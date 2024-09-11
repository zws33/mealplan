package me.zwsmith.backendspringjava;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "recipe_tag")
public class RecipeTag {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "recipe_id", nullable = false)
    private int recipeId;

    @Column(name = "tag", nullable = false)
    private String tag;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(int recipeId) {
        this.recipeId = recipeId;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    // hashCode, equals, and toString

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        RecipeTag that = (RecipeTag) o;
        return Objects.equals(id, that.id) &&
               recipeId == that.recipeId &&
               Objects.equals(tag, that.tag);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, recipeId, tag);
    }

    @Override
    public String toString() {
        return "RecipeTag{" +
               "id=" + id +
               ", recipeId=" + recipeId +
               ", tag='" + tag + '\'' +
               '}';
    }
}