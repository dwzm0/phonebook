const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://dwzm00:${password}@cluster0.0bdqalk.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personeSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: String,
});

const Persone = mongoose.model("Persone", personeSchema);

if (process.argv.length === 5) {
  const persone = new Persone({
    name: `${process.argv[3]}`,
    number: `${process.argv[4]}`,
  });

  persone.save().then((result) => {
    console.log(`${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Persone.find({}).then((result) => {
    result.forEach((persone) => {
      console.log(persone);
    });
    mongoose.connection.close();
  });
}
