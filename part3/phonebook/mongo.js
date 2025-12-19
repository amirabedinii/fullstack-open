import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

// dotenv.config({ path: ".env" });
const uri = `mongodb+srv://abediniamirsepehr_db_user:${password}@cluster0.whe9d3z.mongodb.net?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to MongoDB");
    const phonebookSchema = new mongoose.Schema({
      name: String,
      number: String,
    });

    if (name && number) {
      const Person = mongoose.model("Person", phonebookSchema);

      const person = new Person({
        name: name,
        number: number,
      });

      return person.save();
    } else {
      const Person = mongoose.model("Person", phonebookSchema);
      return Person.find({});
    }
  })
  .then((result) => {
    if (name && number) {
      console.log(`person saved! ${name} ${number}`);
      mongoose.connection.close();
    } else {
      console.log(result);
      mongoose.connection.close();
    }
  })
  .catch((error) => {
    console.log(`error: ${error.message}`);
    mongoose.connection.close();
  });
