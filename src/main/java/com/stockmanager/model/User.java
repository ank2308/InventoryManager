package com.stockmanager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.codehaus.jackson.annotate.JsonManagedReference;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "User")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone_no", nullable = false)
    private String phoneNo;

    @Column(name = "email", nullable = true)
    private String email;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "user_shop_mapping",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "shop_id")
    )
    @JsonManagedReference
    @JsonProperty
    private List<Shop> shops;
}
