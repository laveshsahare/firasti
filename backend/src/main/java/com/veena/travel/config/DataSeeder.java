package com.veena.travel.config;

import com.veena.travel.model.Bus;
import com.veena.travel.model.Flight;
import com.veena.travel.model.Hotel;
import com.veena.travel.model.Role;
import com.veena.travel.model.User;
import com.veena.travel.repository.BusRepository;
import com.veena.travel.repository.FlightRepository;
import com.veena.travel.repository.HotelRepository;
import com.veena.travel.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
  @Bean
  CommandLineRunner seedData(
      UserRepository userRepository,
      HotelRepository hotelRepository,
      FlightRepository flightRepository,
      BusRepository busRepository,
      PasswordEncoder passwordEncoder
  ) {
    return args -> {
      seedUsers(userRepository, passwordEncoder);
      seedHotels(hotelRepository);
      seedFlights(flightRepository);
      seedBuses(busRepository);
    };
  }

  private void seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    if (!userRepository.existsByEmail("admin@veena.com")) {
      var admin = new User();
      admin.setName("Admin");
      admin.setEmail("admin@veena.com");
      admin.setPassword(passwordEncoder.encode("admin@123"));
      admin.setRole(Role.ADMIN);
      userRepository.save(admin);
    }
  }

  private void seedHotels(HotelRepository hotelRepository) {
    if (hotelRepository.count() > 0) {
      return;
    }

    hotelRepository.save(hotel(
        "Azure Bay Resort",
        "Goa, India",
        "7200",
        4.7,
        true,
        "A breezy beach resort with sea-facing rooms and curated dining.",
        List.of("Sea view", "Pool", "Spa", "Breakfast included"),
        List.of("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80")
    ));
    hotelRepository.save(hotel(
        "Himalayan Cedar Retreat",
        "Manali, India",
        "5400",
        4.5,
        true,
        "A mountain hideaway with warm interiors and valley views.",
        List.of("Mountain view", "Bonfire", "Heated rooms", "Free Wi-Fi"),
        List.of("https://images.unsplash.com/photo-1517320964276-a002fa203177?auto=format&fit=crop&w=1200&q=80")
    ));
  }

  private void seedFlights(FlightRepository flightRepository) {
    if (flightRepository.count() > 0) {
      return;
    }

    flightRepository.save(flight("IndiGo", "6E 204", "Delhi", "Goa", "06:20", "08:55", "2h 35m", 0, "6499", 4.4, "Economy"));
    flightRepository.save(flight("Vistara", "UK 747", "Delhi", "Mumbai", "13:25", "15:40", "2h 15m", 0, "8200", 4.7, "Premium Economy"));
  }

  private void seedBuses(BusRepository busRepository) {
    if (busRepository.count() > 0) {
      return;
    }

    busRepository.save(bus("VRL Travels", "VRL 2218", "Bengaluru", "Goa", "21:30", "07:15", "9h 45m", "Volvo Multi-Axle", 18, "1450", 4.4));
    busRepository.save(bus("Orange Tours", "OT 510", "Hyderabad", "Bengaluru", "22:10", "06:20", "8h 10m", "AC Sleeper", 12, "1690", 4.5));
  }

  private Hotel hotel(
      String name,
      String location,
      String price,
      Double rating,
      Boolean featured,
      String description,
      List<String> amenities,
      List<String> images
  ) {
    var hotel = new Hotel();
    hotel.setName(name);
    hotel.setLocation(location);
    hotel.setPricePerNight(new BigDecimal(price));
    hotel.setRating(rating);
    hotel.setFeatured(featured);
    hotel.setDescription(description);
    hotel.setAmenities(amenities);
    hotel.setImages(images);
    return hotel;
  }

  private Flight flight(
      String airline,
      String flightNumber,
      String from,
      String to,
      String departure,
      String arrival,
      String duration,
      Integer stops,
      String price,
      Double rating,
      String cabinClass
  ) {
    var flight = new Flight();
    flight.setAirline(airline);
    flight.setFlightNumber(flightNumber);
    flight.setFrom(from);
    flight.setTo(to);
    flight.setDepartureTime(departure);
    flight.setArrivalTime(arrival);
    flight.setDuration(duration);
    flight.setStops(stops);
    flight.setPrice(new BigDecimal(price));
    flight.setRating(rating);
    flight.setCabinClass(cabinClass);
    return flight;
  }

  private Bus bus(
      String operator,
      String busNumber,
      String from,
      String to,
      String departure,
      String arrival,
      String duration,
      String busType,
      Integer seats,
      String price,
      Double rating
  ) {
    var bus = new Bus();
    bus.setOperator(operator);
    bus.setBusNumber(busNumber);
    bus.setFrom(from);
    bus.setTo(to);
    bus.setDepartureTime(departure);
    bus.setArrivalTime(arrival);
    bus.setDuration(duration);
    bus.setBusType(busType);
    bus.setSeatsAvailable(seats);
    bus.setPrice(new BigDecimal(price));
    bus.setRating(rating);
    return bus;
  }
}
