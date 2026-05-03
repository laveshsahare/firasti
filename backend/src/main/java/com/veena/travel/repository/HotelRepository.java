package com.veena.travel.repository;

import com.veena.travel.model.Hotel;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
  List<Hotel> findByLocationContainingIgnoreCase(String location);

  List<Hotel> findByRatingGreaterThanEqualAndPricePerNightLessThanEqual(Double rating, BigDecimal price);
}
