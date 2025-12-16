const Header = ({ course }) => {
  return <h1>{course}</h1>;
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <>
    {parts.map(part => (
      <Part key={part.id} part={part.name} exercises={part.exercises} />
    ))}
    </>
  );
};

const Total = (props) => {
  return <p>Number of exercises {props.total}</p>;
};

const Course = ({ course }) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0);
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        total={
          total
        }
      />
    </div>
  );
};

export default Course;
