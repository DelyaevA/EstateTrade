package com.example.demo.repository;

import com.example.demo.model.Auction;
import com.example.demo.model.Bet;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface BetRepository extends CrudRepository<Bet, String> {
    List<Bet> findAll();

    @Query(value = "SELECT b FROM Bet b where b.auction=?1 order by b.price desc")
    List<Bet> findAllForAuction(@Param("auction") Auction auction);

    @Modifying
    @Transactional
    @Query(value="delete from Bet b where b.id = ?1")
    void deleteByBetId(String betId);

    @Query(value = "SELECT b FROM Bet b where b.auction=?1 order by b.price desc")
    Optional<Bet> findLastBetForAuction(@Param("auction") Auction auction);
}
