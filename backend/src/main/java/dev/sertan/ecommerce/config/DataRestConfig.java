package dev.sertan.ecommerce.config;

import dev.sertan.ecommerce.entity.Country;
import dev.sertan.ecommerce.entity.Product;
import dev.sertan.ecommerce.entity.ProductCategory;
import dev.sertan.ecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private final EntityManager entityManager;

    public DataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        disableHttpMethods(config, Product.class, unsupportedActions);
        disableHttpMethods(config, ProductCategory.class, unsupportedActions);
        disableHttpMethods(config, Country.class, unsupportedActions);
        disableHttpMethods(config, State.class, unsupportedActions);

        exposeIds(config);
    }

    private void disableHttpMethods(
            RepositoryRestConfiguration config,
            Class<?> mClass,
            HttpMethod[] unsupportedMethods
    ) {
        config.getExposureConfiguration()
                .forDomainType(mClass)
                .withItemExposure((_, httpMethods) ->
                        httpMethods.disable(unsupportedMethods)
                )
                .withCollectionExposure((_, httpMethods) ->
                        httpMethods.disable(unsupportedMethods)
                );

    }

    private void exposeIds(RepositoryRestConfiguration config) {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();
        for (EntityType entityType : entities) {
            entityClasses.add(entityType.getJavaType());
        }

        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
