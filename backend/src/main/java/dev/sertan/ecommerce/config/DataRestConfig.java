package dev.sertan.ecommerce.config;

import dev.sertan.ecommerce.entity.Product;
import dev.sertan.ecommerce.entity.ProductCategory;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((_, httpMethods) ->
                        httpMethods.disable(unsupportedActions)
                )
                .withCollectionExposure((_, httpMethods) ->
                        httpMethods.disable(unsupportedActions)
                );

        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((_, httpMethods) ->
                        httpMethods.disable(unsupportedActions)
                )
                .withCollectionExposure((_, httpMethods) ->
                        httpMethods.disable(unsupportedActions)
                );
    }
}
