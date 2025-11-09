export interface ValidationError {
  field: string;
  message: string;
}

export const validatePollQuestion = (question: string): ValidationError | null => {
  if (!question.trim()) {
    return { field: 'question', message: 'Poll question cannot be empty' };
  }
  if (question.trim().length < 3) {
    return { field: 'question', message: 'Poll question must be at least 3 characters long' };
  }
  return null;
};

export const validateChoices = (choices: string[]): ValidationError | null => {
  if (choices.length < 2) {
    return { field: 'choices', message: 'At least 2 choices are required' };
  }
  if (choices.length > 10) {
    return { field: 'choices', message: 'Maximum 10 choices allowed' };
  }
  
  // Check for empty choices
  const emptyChoices = choices.filter(choice => !choice.trim());
  if (emptyChoices.length > 0) {
    return { field: 'choices', message: 'All choices must have text' };
  }
  
  // Check for duplicate choices
  const trimmedChoices = choices.map(choice => choice.trim().toLowerCase());
  const uniqueChoices = new Set(trimmedChoices);
  if (uniqueChoices.size !== trimmedChoices.length) {
    return { field: 'choices', message: 'Duplicate choices are not allowed' };
  }
  
  return null;
};

export const validatePoll = (question: string, choices: string[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const questionError = validatePollQuestion(question);
  if (questionError) {
    errors.push(questionError);
  }
  
  const choicesError = validateChoices(choices);
  if (choicesError) {
    errors.push(choicesError);
  }
  
  return errors;
};




