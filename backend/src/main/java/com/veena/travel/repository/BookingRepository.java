package com.veena.travel.repository;

import com.veena.travel.model.Booking;
import com.veena.travel.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
  List<Booking> findByUserOrderByIdDesc(User user);
}
