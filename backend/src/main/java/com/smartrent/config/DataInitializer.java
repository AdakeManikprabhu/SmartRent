package com.smartrent.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartrent.entity.*;
import com.smartrent.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final ComplaintRepository complaintRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    public DataInitializer(UserRepository userRepository, PropertyRepository propertyRepository,
                           RoomRepository roomRepository, BookingRepository bookingRepository,
                           PaymentRepository paymentRepository, ComplaintRepository complaintRepository,
                           ReviewRepository reviewRepository, NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.complaintRepository = complaintRepository;
        this.reviewRepository = reviewRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return; // Seed only once

        String pass = passwordEncoder.encode("password123");

        // 1. Create Demo Users
        User tenant1 = userRepository.save(new User("Aarav Sharma", "tenant@smartrent.com", pass, "+91 9876543210", Role.ROLE_TENANT));
        User tenant2 = userRepository.save(new User("Priya Patel", "priya@gmail.com", pass, "+91 9876543211", Role.ROLE_TENANT));
        User tenant3 = userRepository.save(new User("Rohan Mehta", "rohan@gmail.com", pass, "+91 9876543212", Role.ROLE_TENANT));

        User owner1 = userRepository.save(new User("Vikram Reddy (Property Owner)", "owner1@smartrent.com", pass, "+91 9876543220", Role.ROLE_OWNER));
        User owner2 = userRepository.save(new User("Ananya Gupta (Property Owner)", "owner2@smartrent.com", pass, "+91 9876543221", Role.ROLE_OWNER));

        User admin = userRepository.save(new User("System Admin", "admin@smartrent.com", pass, "+91 9876543299", Role.ROLE_ADMIN));

        // 2. Load 115 PG Records from Excel Dataset JSON
        InputStream inputStream = new ClassPathResource("yelahanka_pg_dataset.json").getInputStream();
        JsonNode rootNode = objectMapper.readTree(inputStream);

        String[] sampleImages = {
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
        };

        int index = 0;
        Property firstSavedProperty = null;
        Room firstSavedRoom = null;

        for (JsonNode node : rootNode) {
            String rawPgName = node.path("PG Name").asText();
            
            // Remove raw dataset trailing digits (e.g., '14') and 'Yela' abbreviation if standalone
            String pgName = rawPgName.replaceAll("(?i)\\bYela\\b", "")
                                     .replaceAll("\\s+\\d+$", "")
                                     .replaceAll("\\s+", " ")
                                     .trim();

            String category = node.path("Category").asText();
            String area = node.path("Area / Location").asText().trim();
            String targetColleges = node.path("Target Colleges Nearby").asText().trim();
            double singleRent = node.path("Single Sharing (\u20b9)").asDouble(12000);
            double twinRent = node.path("Twin Sharing (\u20b9)").asDouble(9500);
            double tripleRent = node.path("Triple Sharing (\u20b9)").asDouble(7500);
            double deposit = node.path("Security Deposit (\u20b9)").asDouble(20000);
            double distKm = node.path("Distance to College (km)").asDouble(1.2);
            String metro = node.path("Nearest Metro Station").asText().trim();
            String busStand = node.path("Nearest Bus Stand").asText().trim();
            String excelPhoto = node.path("Room & Interior Photo Link").asText().trim();

            Property p = new Property();
            p.setName(pgName);
            p.setArea(area); // Exact area (e.g. BTM Layout, Koramangala, Indiranagar, Whitefield, HSR Layout, Yelahanka Old Town, etc.)
            p.setLandmark("Near " + targetColleges);
            p.setDescription("Verified " + category + " PG in " + area + ", Bengaluru. Convenient for students & professionals at " + targetColleges + ". Nearest bus stand: " + busStand + ", Metro: " + metro + ". Fully furnished with 24/7 security, high-speed Wi-Fi, and daily housekeeping.");
            p.setAddress(area + ", Bengaluru");
            p.setCity("Bengaluru");
            p.setPincode("5600" + (10 + (index % 80)));
            p.setDistanceKm(distKm);
            p.setOwner(index % 2 == 0 ? owner1 : owner2);
            p.setStatus(PropertyStatus.VERIFIED);
            p.setFeatured(index < 10);
            p.setRatingAvg(Math.round((4.2 + (index % 8) * 0.1) * 10.0) / 10.0);
            p.setReviewCount(12 + index * 2);

            double startingRent = Math.min(singleRent, Math.min(twinRent, tripleRent));
            p.setStartingRent(startingRent);

            p.setAmenities(Set.of("Wi-Fi", "Food", "Laundry", "Parking", "Security", "AC", "Power Backup"));

            String mainImgUrl = (excelPhoto != null && excelPhoto.startsWith("http")) 
                ? excelPhoto 
                : sampleImages[index % sampleImages.length];

            p.getImages().add(new PropertyImage(p, mainImgUrl, true));
            p.getImages().add(new PropertyImage(p, sampleImages[(index + 1) % sampleImages.length], false));

            Property savedProp = propertyRepository.save(p);
            if (firstSavedProperty == null) firstSavedProperty = savedProp;

            // Save Single, Twin, Triple Rooms for each PG
            Room r1 = roomRepository.save(new Room(savedProp, "R-101", RoomType.SINGLE, singleRent, deposit, true, true, 1, 1));
            Room r2 = roomRepository.save(new Room(savedProp, "R-102", RoomType.DOUBLE, twinRent, deposit, true, true, 2, 2));
            Room r3 = roomRepository.save(new Room(savedProp, "R-103", RoomType.TRIPLE, tripleRent, deposit, false, true, 3, 3));

            if (firstSavedRoom == null) firstSavedRoom = r2;
            index++;
        }

        // 3. Create Sample Active Booking for Tenant 1
        if (firstSavedProperty != null && firstSavedRoom != null) {
            Booking booking1 = new Booking();
            booking1.setTenant(tenant1);
            booking1.setRoom(firstSavedRoom);
            booking1.setProperty(firstSavedProperty);
            booking1.setMoveInDate(LocalDate.now().minusDays(15));
            booking1.setDurationMonths(11);
            booking1.setTotalMonthlyRent(firstSavedRoom.getRentMonthly());
            booking1.setStatus(BookingStatus.APPROVED);
            booking1.setNotes("Prefers North Indian & South Indian meal options");
            Booking savedB1 = bookingRepository.save(booking1);

            Payment pay1 = new Payment();
            pay1.setBooking(savedB1);
            pay1.setTenant(tenant1);
            pay1.setAmount(firstSavedRoom.getRentMonthly());
            pay1.setDueDate(LocalDate.now().minusDays(10));
            pay1.setPaidDate(LocalDateTime.now().minusDays(9));
            pay1.setMonthYear("August 2026");
            pay1.setStatus(PaymentStatus.PAID);
            pay1.setTransactionId("TXN-BLR-982347");
            pay1.setPaymentMethod("UPI (Google Pay)");
            paymentRepository.save(pay1);

            Payment pay2 = new Payment();
            pay2.setBooking(savedB1);
            pay2.setTenant(tenant1);
            pay2.setAmount(firstSavedRoom.getRentMonthly());
            pay2.setDueDate(LocalDate.now().plusDays(5));
            pay2.setMonthYear("September 2026");
            pay2.setStatus(PaymentStatus.PENDING);
            paymentRepository.save(pay2);

            Complaint c1 = new Complaint();
            c1.setTenant(tenant1);
            c1.setProperty(firstSavedProperty);
            c1.setRoom(firstSavedRoom);
            c1.setTitle("High-speed Wi-Fi router signal weak in Room R-102");
            c1.setDescription("The 5GHz router connection drops occasionally between 8 PM and 10 PM.");
            c1.setCategory(ComplaintCategory.WIFI);
            c1.setPriority(ComplaintPriority.MEDIUM);
            c1.setStatus(ComplaintStatus.IN_PROGRESS);
            c1.setResolutionNotes("Technician assigned to install dedicated Wi-Fi extender");
            complaintRepository.save(c1);

            Review rev1 = new Review();
            rev1.setTenant(tenant1);
            rev1.setProperty(firstSavedProperty);
            rev1.setRating(5);
            rev1.setCleanliness(5);
            rev1.setFood(5);
            rev1.setLocation(5);
            rev1.setSecurity(5);
            rev1.setFacilities(5);
            rev1.setValueForMoney(5);
            rev1.setComment(firstSavedProperty.getName() + " is super convenient for college commute. Great food, daily housekeeping, and 24/7 security!");
            reviewRepository.save(rev1);

            notificationRepository.save(new Notification(tenant1, "Rent Due Reminder", "Your monthly rent of ₹" + firstSavedRoom.getRentMonthly() + " for September 2026 is due in 5 days.", "PAYMENT", "/tenant/dashboard"));
            notificationRepository.save(new Notification(owner1, "New Complaint Logged", "Aarav Sharma reported a Wi-Fi issue for " + firstSavedProperty.getName() + ".", "COMPLAINT", "/owner/complaints"));
        }
    }
}
