import { Poll, PollResults } from '../types/poll.types';

export const generatePollResults = (poll: Poll): PollResults => {
  const totalVotes = poll.choices.reduce((sum, choice) => sum + choice.votes, 0);
  
  const results = poll.choices.map(choice => ({
    choice: choice.text,
    votes: choice.votes,
    percentage: totalVotes > 0 ? Math.round((choice.votes / totalVotes) * 100) : 0
  }));

  return {
    question: poll.question,
    totalVotes,
    results,
    exportedAt: new Date().toISOString()
  };
};

export const exportToCSV = (poll: Poll): void => {
  const results = generatePollResults(poll);
  const csvContent = [
    'Choice,Votes,Percentage',
    ...results.results.map(result => `${result.choice},${result.votes},${result.percentage}%`),
    `Total,${results.totalVotes},100%`
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `poll-results-${poll.question.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (poll: Poll): void => {
  const results = generatePollResults(poll);
  const jsonContent = JSON.stringify(results, null, 2);
  
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `poll-results-${poll.question.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateShareableLink = (poll: Poll): string => {
  const pollData = encodeURIComponent(JSON.stringify({
    question: poll.question,
    choices: poll.choices.map(choice => ({ text: choice.text, votes: 0 })),
    design: poll.design
  }));
  
  return `${window.location.origin}${window.location.pathname}?poll=${pollData}`;
};




