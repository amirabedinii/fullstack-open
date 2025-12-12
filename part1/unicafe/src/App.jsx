import { useState } from "react";
const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};
// const StatisticLine = ({ text, value }) => {
//   return (
//     <tr><td>{text}</td><td>{value}</td></tr>
//   );
// };
// const Statistics = (props) => {
 
//   return (
//     <table>
//       <tbody>
//       <StatisticLine text="number of good" value={props.good} />
//         <StatisticLine text="number of neutral" value={props.neutral} />
//         <StatisticLine text="number of bad" value={props.bad} />
//         <StatisticLine text="all" value={props.all} />
//         <StatisticLine text="average" value={props.average} />
//         <StatisticLine text="positive" value={props.positive} />
//       </tbody>
//     </table>
//   );
// };

const App = () => {
  // save clicks of each button to its own state
  // const [good, setGood] = useState(0);
  // const [neutral, setNeutral] = useState(0);
  // const [bad, setBad] = useState(0);

  // const all = good + neutral + bad;
  // const average = all === 0 ? 0 : (good - bad) / all;
  // const positive = all === 0 ? 0 : (good / all) * 100;

  // const hasFeedback = good > 0 || neutral > 0 || bad > 0;

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));
  const mostVotes = votes.indexOf(Math.max(...votes));  
  const mostVotedAnecdote = anecdotes[mostVotes];
  const handleVote = () => {
    const newVotes = [...votes];
    newVotes[selected]++;
    setVotes(newVotes);
  }
  return (
    <div>
      <Button onClick={() => setSelected(Math.floor(Math.random() * anecdotes.length))} text="next anecdote" />
      <p>{anecdotes[selected]}</p>
      <Button onClick={handleVote} text="vote" />
      <p>has {votes[selected]} votes</p>
      <p>the most voted anecdote is:  {mostVotedAnecdote}</p>
      {/* <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      {hasFeedback ? (
        <Statistics
          good={good}
          neutral={neutral}
          bad={bad}
          all={all}
          average={average}
          positive={positive}
        />
      ) : (
        <p>No feedback given</p>
      )} */}
    </div>
  );
};

export default App;
