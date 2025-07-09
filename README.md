# jq

`jq` is a beginner-friendly JavaScript tool that helps you work with lists of data (arrays of objects) just like a mini database. It lets you write simple, SQL-like queries and perform common data tasks — without needing a real database or backend.

---

## 🌟 Why Use jq?

* 🔍 Query JSON data easily, like writing SQL
* 🧱 Chain operations together (like filtering, sorting, etc.)
* 🧑‍💻 No setup or config — just use it in your JavaScript code
* 🚀 Great for dashboards, data filtering, and learning

---

## 🪰 How to Use It

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

Each function supports chaining and ends with `.get()` to return the final result.

---

### `.query(sql, params)`

SQL-like query syntax using `?` for values.

```js
const result = new jq(data)
  .query("SELECT name, age WHERE age BETWEEN ? AND ? ORDER BY age DESC LIMIT 2", [25, 35]);
```

**Output:**

```js
[{ name: "Carol", age: 35 }, { name: "Alice", age: 30 }]
```

---

### `.filter(callback)`

```js
new jq(data).filter(person => person.age > 25).get();
```

---

### `.map(callback)`

```js
new jq(data)
  .map(person => ({ label: person.name, value: person.age }))
  .get();
```

---

### `.sort(compareFn)`

```js
new jq(data).sort((a, b) => b.age - a.age).get();
```

---

### `.limit(n)`

```js
new jq(data).limit(2).get();
```

---

### `.unique(key)`

```js
const emails = [
  { email: "a@x.com" }, { email: "a@x.com" }, { email: "b@x.com" }
];
new jq(emails).unique("email").get();
```

---

### `.groupBy(key)`

```js
const people = [
  { name: "Alice", dept: "HR" }, { name: "Bob", dept: "IT" }, { name: "Carol", dept: "HR" }
];
new jq(people).groupBy("dept").get();
```

---

### `.sum(key)`

```js
new jq(data).sum("score").get();
```

---

### `.average(key)`

```js
new jq(data).average("score").get();
```

---

### `.pluck(key)`

```js
new jq(data).pluck("name").get();
```

---

### `.pluckMany([keys])`

```js
new jq(data).pluckMany(["name", "age"]).get();
```

---

### `.find(callback)`

```js
new jq(data).find(person => person.name === "Bob").get();
```

---

### `.join(otherArray, leftKey, rightKey, type)`

```js
const users = [ { id: 1, name: "Alice" }, { id: 2, name: "Bob" } ];
const orders = [ { userId: 1, total: 100 }, { userId: 2, total: 75 } ];

new jq(users)
  .join(orders, "id", "userId", "INNER")
  .query("SELECT name, total");
```

---

### `.reset()`

```js
const query = new jq(data).filter(x => x.age > 30);
query.reset().get();
```

---

### `.get()`

Returns the current data at any point in the chain.

---

## 🧠 Who Is This For?

* Beginners learning JavaScript or frontend development
* Developers building filters, search, dashboards
* Anyone who wants SQL-style querying in vanilla JS

---

## 📌 SQL Query Tips

Use the `.query()` method for SQL-like power.

**Examples:**

```sql
SELECT name, age
WHERE age > ? AND dept IN (?)
ORDER BY age DESC
LIMIT 3
```

📅 Supported:

* `WHERE`
* `ORDER BY`
* `LIMIT`
* `IN`, `NOT IN`, `BETWEEN`, `LIKE`

---

## 🎉 Try It Out

Paste the class and some sample data into a CodePen, JSFiddle, or your project to try it out.

Happy querying! 🔍💻
