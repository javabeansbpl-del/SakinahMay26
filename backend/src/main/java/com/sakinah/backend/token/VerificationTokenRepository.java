package com.sakinah.backend.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Integer> {

    // find token by its string value when user clicks the link
    Optional<VerificationToken> findByToken(String token);

    // delete all tokens for a user after successful verification
    void deleteByUser(com.sakinah.backend.user.User user);
}