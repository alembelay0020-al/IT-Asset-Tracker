
package com.example.main.project.service;

import com.example.main.project.dto.CategoryRequest;
import com.example.main.project.dto.CategoryResponse;
import com.example.main.project.entity.Category;
import com.example.main.project.repository.CategoryRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName()))
                .toList();
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        String name = request.name().trim();

        if (name.isBlank()) {
            throw new IllegalArgumentException(
                    "Category name cannot be blank");
        }

        if (categoryRepository.existsByName(name)) {
            throw new IllegalArgumentException(
                    "A category with this name already exists");
        }

        Category category = new Category();
        category.setName(name);

        Category saved = categoryRepository.save(category);

        return new CategoryResponse(
                saved.getId(),
                saved.getName());
    }
}
