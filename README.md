# jq

`jq` is a beginner-friendly JavaScript tool that helps you work with lists of data (arrays of objects) just like a mini database. It lets you write simple, SQL-like queries and perform common data tasks — without needing a real database or backend.

---

## 🌟 Why Use jq?

* 🔍 Query JSON data easily, like writing SQL
* 🧱 Chain operations together (like filtering, sorting, etc.)
* 🧑‍💻 No setup or config — just use it in your JavaScript code
* 🚀 Great for dashboards, data filtering, and learning

---

## 🧰 How to Use It

1. Copy the `jq` class into your JavaScript file.
2. Pass your data (an array of objects) to it.
3. Use the provided functions to manipulate and query the data.

```js
const myData = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
];

const result = new jq(myData).query("SELECT name WHERE age > ?", [26]);
console.log(result); // [{ name: "Alice" }]
```

---

## 📘 Functions with Beginner-Friendly Examples

### `.query(sql, params)`

Write simple queries like in SQL. Use `?` for placeholders:

```js
const result = new jq(data)
  .query("SELECT name, age WHERE age BETWEEN ? AND ? ORDER BY age DESC LIMIT 2", [20, 35]);
```

### `.filter(callback)`

Filter using regular JavaScript:

```js
new jq(data)
  .filter(person => person.age > 25)
  .get();
```

### `.map(callback)`

Transform data:

```js
new jq(data)
  .map(person => ({ label: person.name, value: person.age }))
  .get();
```

### `.sort(compareFn)`

Sort the data:

```js
new jq(data)
  .sort((a, b) => b.age - a.age) // Descending
  .get();
```

### `.limit(n)`

Take only the first `n` results:

```js
new jq(data)
  .limit(2)
  .get();
```

### `.unique(key)`

Remove duplicates by a field:

```js
const emails = [
  { email: "a@x.com" }, { email: "a@x.com" }, { email: "b@x.com" }
];
new jq(emails).unique("email").get();
```

### `.groupBy(key)`

Group by a specific field:

```js
const people = [
  { name: "Alice", dept: "HR" }, { name: "Bob", dept: "IT" }, { name: "Carol", dept: "HR" }
];
new jq(people).groupBy("dept").get();
```

### `.sum(key)`

Add values in a field:

```js
new jq(data).sum("score").get();
```

### `.average(key)`

Calculate the average:

```js
new jq(data).average("score").get();
```

### `.pluck(key)`

Get only one property from each item:

```js
new jq(data).pluck("name").get();
```

### `.pluckMany([keys])`

Pick multiple fields:

```js
new jq(data).pluckMany(["name", "age"]).get();
```

### `.find(callback)`

Find the first match:

```js
new jq(data).find(person => person.name === "Bob").get();
```

### `.join(otherArray, leftKey, rightKey, type)`

Merge (JOIN) two datasets:

```js
const users = [ { id: 1, name: "Alice" }, { id: 2, name: "Bob" } ];
const orders = [ { userId: 1, total: 100 }, { userId: 2, total: 75 } ];

new jq(users)
  .join(orders, "id", "userId", "INNER")
  .query("SELECT name, total");
```

### `.reset()`

Go back to the original data:

```js
const query = new jq(data).filter(x => x.age > 30);
query.reset().get();
```

### `.get()`

Get the current results (optional after most functions).

---

## 🧠 Who Is This For?

* Beginners learning JavaScript or frontend
* Devs building filters, lists, dashboards
* Anyone who wants SQL-style power in JS

---

## 📌 SQL Query Tips

* `SELECT field1, field2`
* `WHERE age > ? AND score < ?`
* `ORDER BY age DESC`
* `LIMIT 3`

You can also use:

* `IN (?)` → match against a list
* `NOT IN (?)`
* `BETWEEN ? AND ?`
* `LIKE ?` → partial matches (e.g., `%ice%`)

---

## 🎉 Try It Out

Copy this into a CodePen, JSFiddle, or your local project and test it on real data.

Happy querying! 🔍💻
