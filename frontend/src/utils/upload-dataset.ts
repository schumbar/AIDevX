/**
 * Interface for dataset info
 */
export interface DatasetInfo {
  name: string;
  extension: string;
  size: number;
  path?: string; // Path in the runtime container
  content?: string; // Base64 content
}

/**
 * Converts a file to base64
 *
 * @param file The file to convert
 * @returns A promise that resolves to the base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Converts a file to text
 *
 * @param file The file to convert
 * @returns A promise that resolves to the text content
 */
export const fileToText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Processes a dataset file for inclusion in a message
 *
 * @param file The file to process
 * @returns A promise that resolves to the dataset info
 */
export const processDatasetFile = async (file: File): Promise<DatasetInfo | null> => {
  try {
    // For small text files (CSV, JSON, TXT), convert to text
    let content: string;
    if ((file.type.includes('text') ||
         file.name.endsWith('.csv') ||
         file.name.endsWith('.json') ||
         file.name.endsWith('.txt')) &&
        file.size < 1024 * 1024) { // Less than 1MB
      content = await fileToText(file);
    } else {
      // For other files, convert to base64
      content = await fileToBase64(file);
    }

    return {
      name: file.name,
      extension: file.name.split('.').pop()?.toLowerCase() || '',
      size: file.size,
      path: `/workspace/uploads/${file.name}`,
      content: content,
    };
  } catch (error) {
    console.error("Error processing dataset file:", error);
    return null;
  }
};

/**
 * Generates ML pipeline instructions based on the dataset information
 * following the CRISP-DM methodology
 *
 * @param datasets Array of dataset information
 * @returns A string with instructions for the ML pipeline
 */
export const generateMLPipelineInstructions = (
  datasets: DatasetInfo[]
): string => {
  if (datasets.length === 0) {
    return "";
  }

  // No need to create analysis instructions as we're keeping the prompt simple

  return `
I've uploaded the following dataset file(s) to the workspace/uploads directory:
${datasets.map(file => `- ${file.name}`).join('\n')}

Please use this dataset to build an end-to-end machine learning solution following the CRISP-DM methodology. I need a comprehensive analysis with the following steps:

1. Business Understanding
   - Identify specific business problems this data could help solve
   - Define clear objectives, success criteria, and key performance indicators
   - Explain how solving this problem creates business value

2. Data Understanding
   - Perform exploratory data analysis (EDA) with visualizations
   - Identify patterns, correlations, and potential insights
   - Assess data quality, completeness, and distribution
   - Identify outliers and anomalies

3. Data Preparation
   - Implement thorough data cleaning procedures:
     * Handle missing values with appropriate imputation techniques
     * Remove or transform outliers
     * Fix inconsistencies and errors in the data
   - Feature Engineering:
     * Create new features that better represent underlying patterns
     * Transform existing features (normalization, standardization, etc.)
     * Encode categorical variables appropriately
   - Feature Selection:
     * Identify the most important features using statistical methods
     * Remove redundant or irrelevant features
     * Apply dimensionality reduction if needed

4. Modeling
   - Develop multiple models appropriate for the problem:
     * Try different algorithms (decision trees, neural networks, etc.)
     * Implement cross-validation to ensure robustness
     * Tune hyperparameters systematically
   - Compare model performance using appropriate metrics
   - Explain model selection rationale and tradeoffs

5. Evaluation
   - Evaluate model performance against business objectives
   - Analyze model errors and edge cases
   - Perform sensitivity analysis
   - Assess model fairness and bias
   - Validate model on holdout data

6. Deployment
   - Provide a clear implementation strategy
   - Outline monitoring and maintenance requirements
   - Create a deployment pipeline with validation steps
   - Suggest A/B testing approach if applicable

7. Final Report
   - Generate a comprehensive report with:
     * Executive summary for business stakeholders
     * Technical details of the implementation
     * Visualizations of results and model performance
     * Recommendations for future improvements
   - Provide a link to a web interface (like Streamlit, Gradio, or Flask) that demonstrates the model working correctly

Let's start by understanding what this data represents and what business problems we can solve with it. Please be thorough in your analysis and implementation.
`;
};

/**
 * Generates basic dataset analysis instructions
 *
 * @param datasets Array of dataset information
 * @returns A string with instructions for dataset analysis
 */
export const generateDatasetAnalysisInstructions = (
  datasets: DatasetInfo[]
): string => {
  if (datasets.length === 0) {
    return "";
  }

  // No need to create analysis instructions as we're keeping the prompt simple

  return `
I've uploaded the following dataset file(s) to the workspace/uploads directory:
${datasets.map(file => `- ${file.name}`).join('\n')}
`;
// Please perform a comprehensive analysis of this dataset following the CRISP-DM methodology. I need a detailed exploration with:

// 1. Data Understanding
//    - Perform exploratory data analysis (EDA) with visualizations
//    - Identify patterns, correlations, and potential insights
//    - Assess data quality, completeness, and distribution
//    - Identify outliers and anomalies

// 2. Data Preparation Recommendations
//    - Suggest data cleaning procedures for:
//      * Handling missing values
//      * Addressing outliers
//      * Fixing inconsistencies and errors
//    - Recommend feature engineering approaches
//    - Suggest feature selection methods

// 3. Modeling Potential
//    - Identify suitable machine learning algorithms for this data
//    - Explain why these algorithms would work well
//    - Suggest evaluation metrics and validation approaches

// 4. Implementation Strategy
//    - Outline steps to build an effective solution
//    - Identify potential challenges and how to overcome them
//    - Suggest tools and libraries for implementation

// 5. Final Report
//    - Provide a detailed summary of findings
//    - Include visualizations of key insights
//    - Recommend next steps

// Please be thorough in your analysis and provide a link to a web interface (like Streamlit, Gradio, or Flask) that could be used to demonstrate any models built with this data.
// `;
};
