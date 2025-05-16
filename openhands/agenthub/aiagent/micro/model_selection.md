---
name: model_selection
agent: AIAgent
triggers:
- model selection
- classification
- regression
- clustering
- model
- algorithm
---

# Machine Learning Model Selection Guide

## Classification Models

### Linear Models
- **Logistic Regression**
  - Best for: Linear decision boundaries, binary/multiclass classification
  - Pros: Interpretable, probabilistic, efficient
  - Cons: Limited to linear relationships
  - Code: `from sklearn.linear_model import LogisticRegression`

### Tree-Based Models
- **Decision Tree**
  - Best for: Non-linear relationships, feature importance
  - Pros: Interpretable, handles mixed data types
  - Cons: Prone to overfitting
  - Code: `from sklearn.tree import DecisionTreeClassifier`

- **Random Forest**
  - Best for: Complex relationships, robust performance
  - Pros: Reduces overfitting, handles high-dimensional data
  - Cons: Less interpretable, computationally intensive
  - Code: `from sklearn.ensemble import RandomForestClassifier`

- **Gradient Boosting**
  - Best for: High performance, complex relationships
  - Pros: Often best performance, handles imbalanced data
  - Cons: Computationally intensive, requires tuning
  - Code: `from sklearn.ensemble import GradientBoostingClassifier`
  - XGBoost: `from xgboost import XGBClassifier`

### Support Vector Machines
- **SVM**
  - Best for: High-dimensional data, complex boundaries
  - Pros: Effective in high dimensions, handles non-linear boundaries
  - Cons: Sensitive to parameters, slower on large datasets
  - Code: `from sklearn.svm import SVC`

### Neural Networks
- **Multi-layer Perceptron**
  - Best for: Complex patterns, large datasets
  - Pros: Can model highly complex relationships
  - Cons: Requires large data, black-box model
  - Code: `from sklearn.neural_network import MLPClassifier`

## Regression Models

### Linear Models
- **Linear Regression**
  - Best for: Linear relationships, baseline model
  - Pros: Simple, interpretable, efficient
  - Cons: Limited to linear relationships
  - Code: `from sklearn.linear_model import LinearRegression`

- **Ridge/Lasso Regression**
  - Best for: High-dimensional data, correlated features
  - Pros: Reduces overfitting, feature selection (Lasso)
  - Cons: Still limited to linear relationships
  - Code: `from sklearn.linear_model import Ridge, Lasso`

### Tree-Based Models
- **Decision Tree Regressor**
  - Best for: Non-linear relationships
  - Pros: Handles non-linearity, interpretable
  - Cons: Prone to overfitting
  - Code: `from sklearn.tree import DecisionTreeRegressor`

- **Random Forest Regressor**
  - Best for: Complex relationships, robust performance
  - Pros: Reduces overfitting, handles high-dimensional data
  - Cons: Less interpretable
  - Code: `from sklearn.ensemble import RandomForestRegressor`

- **Gradient Boosting Regressor**
  - Best for: High performance, complex relationships
  - Pros: Often best performance
  - Cons: Computationally intensive, requires tuning
  - Code: `from sklearn.ensemble import GradientBoostingRegressor`
  - XGBoost: `from xgboost import XGBRegressor`

### Support Vector Machines
- **SVR**
  - Best for: Non-linear relationships
  - Pros: Effective for non-linear patterns
  - Cons: Sensitive to parameters, slower on large datasets
  - Code: `from sklearn.svm import SVR`

## Clustering Models

### Centroid-Based
- **K-Means**
  - Best for: Well-separated clusters, large datasets
  - Pros: Simple, efficient, scalable
  - Cons: Requires number of clusters, sensitive to outliers
  - Code: `from sklearn.cluster import KMeans`

### Density-Based
- **DBSCAN**
  - Best for: Arbitrary shaped clusters, outlier detection
  - Pros: No need to specify number of clusters, handles outliers
  - Cons: Sensitive to parameters, struggles with varying densities
  - Code: `from sklearn.cluster import DBSCAN`

### Hierarchical
- **Agglomerative Clustering**
  - Best for: Hierarchical relationships, smaller datasets
  - Pros: Creates dendrogram, no need to specify clusters upfront
  - Cons: Computationally intensive, less scalable
  - Code: `from sklearn.cluster import AgglomerativeClustering`

## Model Selection Process

1. **Understand the problem**:
   - Classification, regression, or clustering?
   - Evaluation metrics (accuracy, F1, RMSE, silhouette score)

2. **Analyze the data**:
   - Size (rows, columns)
   - Types (numerical, categorical)
   - Missing values, outliers
   - Feature relationships

3. **Start simple**:
   - Begin with baseline models (logistic/linear regression)
   - Evaluate performance with cross-validation

4. **Try more complex models**:
   - Random Forest, Gradient Boosting, SVM
   - Compare performance to baseline

5. **Ensemble methods**:
   - Combine multiple models for better performance
   - Voting, stacking, or blending

6. **Hyperparameter tuning**:
   - Grid search or random search
   - Code: `from sklearn.model_selection import GridSearchCV`
