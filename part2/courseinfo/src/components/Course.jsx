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
      <Part part={parts[0].name} exercises={parts[0].exercises} />
      <Part part={parts[1].name} exercises={parts[1].exercises} />
      <Part part={parts[2].name} exercises={parts[2].exercises} />
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
