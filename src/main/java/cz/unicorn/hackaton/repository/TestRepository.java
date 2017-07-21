package cz.unicorn.hackaton.repository;

import org.springframework.data.repository.CrudRepository;

import cz.unicorn.hackaton.entity.TestEntity;

public interface TestRepository extends CrudRepository<TestEntity, Long> {

}
