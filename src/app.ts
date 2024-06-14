import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./pgConfig";
import {
  Student,
  Order,
  NumberArray,
} from "./types";

import {
  filterPassedStudents,
  getStudentNames,
  sortStudentsByGrade,
  getAverageAge,
} from "./logic";

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SQL query to create the orders table if not exists
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        orderID VARCHAR(255)  NOT NULL
    );
`;

// Connect to the database and create the orders table if not exists
pool.connect((err, client, done) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  // Execute the query to create the orders table
  client?.query(createTableQuery, (err, result) => {
    done(); // Release the client back to the pool

    if (err) {
      console.error("Error creating table:", err);
      return;
    }

    console.log('Table "orders" created successfully');
  });
});


app.post("/processOrders", async (req: Request, res: Response) => {
  try {
    const { items } = req.body as { items: Order[] };

    if (!items || !Array.isArray(items)) {
      return res
        .status(400)
        .json({ error: "Invalid payload format, please provide items list" });
    }

    const filteredOrders = items.filter((item: any) => {
      return item.OrderBlocks.some((block: any) => {
        return (
          Array.isArray(block.lineNo) &&
          block.lineNo.some((line: number) => line % 3 === 0)
        );
      });
    });

    const filteredOutOrders = items.filter((item: any) => {
      return !item.OrderBlocks.some((block: any) => {
        return (
          Array.isArray(block.lineNo) &&
          block.lineNo.some((line: number) => line % 3 === 0)
        );
      });
    });

    const client = await pool.connect();
    try {
      for (const item of items) {
        const orderID = item.orderID;
        // Check if orderID already exists in the table
        const result = await client.query(
          "SELECT orderID FROM orders WHERE orderID = $1",
          [orderID],
        );
        if (result.rows.length === 0) {
          await client.query("INSERT INTO orders (orderID) VALUES ($1)", [
            orderID,
          ]);
        }
      }
    } finally {
      client.release();
    }

    res.status(200).json({
      message:
        "Orders are processed and stored successfully in the PostgreSQL database hosted in the SUPABASE cloud.",
      "FilterOut the Orders whose any OrderBlock’s LineNo is divisible by 3":
        filteredOrders,
      "FilterOut the Orders whose any OrderBlock’s LineNo is not divisible by 3":
        filteredOutOrders,
    });
  } catch (error) {
    console.error("Error processing orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ output: "this is Viraj Bhosale!, your server is ready" });
});

app.post("/processArray", async (req: Request, res: Response) => {
  try {
    const { array } = req.body as { array: NumberArray };

    if (!array || !Array.isArray(array)) {
      return res
        .status(400)
        .json({ error: "Invalid payload format, please provide an array" });
    }

    const arrayFunctionsResult = {
      "Length of the array": array.length,
      "Concatenated array": array.concat([4, 5, 6]),
      "Every element is greater than 0": array.every((val) => val > 0),
      "Filtered array (even numbers)": array.filter((val) => val % 2 === 0),
      "First element greater than 2": array.find((val) => val > 2),
      "Index of the first element greater than 2": array.findIndex(
        (val) => val > 2,
      ),
      "Includes value 2": array.includes(2),
      "Index of value 2": array.indexOf(2),
      "Joined array elements with '-'": array.join("-"),
      "Last index of value 2": array.lastIndexOf(2),
      "Mapped array (doubled each element)": array.map((val) => val * 2),
      "Popped last element": array.pop(),
      "Pushed 4 into the array": array.push(4),
      "Reduced array (sum of all elements)": array.reduce(
        (acc, val) => acc + val,
        0,
      ),
      "ReducedRight array (sum of all elements from right)": array.reduceRight(
        (acc, val) => acc + val,
        0,
      ),
      "Reversed array": array.reverse(),
      "Shifted first element": array.shift(),
      "Sliced array (from index 1 to 3)": array.slice(1, 3),
      "Some elements are greater than 2": array.some((val) => val > 2),
      "Sorted array": array.slice().sort((a, b) => a - b),
      "Spliced array (removed 2 elements from index 1)": array.splice(1, 2),
      "Converted array to string": array.toString(),
      "Unshifted 0 into the array": array.unshift(0),
      "sorted array in ascending order is": array.slice().sort((a, b) => a - b),
    };

    res.status(200).json(arrayFunctionsResult);
  } catch (error) {
    console.error("Error processing array:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//taken hardcoded array of objects
const students = [
  { name: "Alice", age: 20, grade: 75 },
  { name: "Bob", age: 22, grade: 85 },
  { name: "Charlie", age: 21, grade: 60 },
  { name: "David", age: 19, grade: 45 },
  { name: "Eve", age: 20, grade: 90 },
];

console.log("Passed students:", filterPassedStudents(students));
console.log("Student names:", getStudentNames(students));
console.log("Students sorted by grade:", sortStudentsByGrade(students));
console.log("Average age of students:", getAverageAge(students));



//here i have made an post api endpoint to process the students array

app.post("/processStudents", (req: Request, res: Response) => {
  try {
    const { students } = req.body as { students: Student[] };

    if (!students || !Array.isArray(students)) {
      return res
        .status(400)
        .json({
          error: "Invalid payload format, please provide an array of students",
        });
    }

    const passedStudents = filterPassedStudents(students);
    const studentNames = getStudentNames(students);
    const studentsSortedByGrade = sortStudentsByGrade(students);
    const averageAge = getAverageAge(students);

    const studentsResult = {
      "Passed students": passedStudents,
      "Student names": studentNames,
      "Students sorted by grade": studentsSortedByGrade,
      "Average age of students": averageAge,
    };

    res.status(200).json(studentsResult);
  } catch (error) {
    console.error("Error processing students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
