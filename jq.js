// jq: Fully working chainable JSON query engine with SQL-like syntax
class jq {
  constructor(data) {
    this.originalData = Array.isArray(data) ? [...data] : [];
    this.data = [...this.originalData];
  }

  filter(callback) {
    this.data = this.data.filter(callback);
    return this;
  }

  map(callback) {
    this.data = this.data.map(callback);
    return this;
  }

  sort(compareFn) {
    this.data = [...this.data].sort(compareFn);
    return this;
  }

  limit(n) {
    this.data = this.data.slice(0, n);
    return this;
  }

  unique(key) {
    const seen = new Set();
    this.data = this.data.filter(item => {
      const val = key ? item[key] : JSON.stringify(item);
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
    return this;
  }

  groupBy(key) {
    this.data = this.data.reduce((groups, item) => {
      const groupKey = item[key];
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
      return groups;
    }, {});
    return this;
  }

  find(callback) {
    this.data = this.data.find(callback);
    return this;
  }

  pluck(key) {
    this.data = this.data.map(item => item[key]);
    return this;
  }

  pluckMany(keys) {
    this.data = this.data.map(item => {
      const obj = {};
      keys.forEach(k => obj[k] = item[k]);
      return obj;
    });
    return this;
  }

  sum(key) {
    this.data = this.data.reduce((acc, item) => acc + (parseFloat(item[key]) || 0), 0);
    return this;
  }

  average(key) {
    const total = this.data.reduce((acc, item) => acc + (parseFloat(item[key]) || 0), 0);
    const count = this.data.length;
    this.data = count ? total / count : 0;
    return this;
  }

  reset() {
    this.data = [...this.originalData];
    return this;
  }

  get() {
    return this.data;
  }

  _compare(a, operator, b) {
    switch (operator) {
      case '=': return a == b;
      case '!=': return a != b;
      case '>': return a > b;
      case '<': return a < b;
      case '>=': return a >= b;
      case '<=': return a <= b;
      default: return false;
    }
  }

  join(otherArray, leftKey, rightKey, type = "INNER") {
    const joined = [];

    for (const left of this.data) {
      let matched = false;

      for (const right of otherArray) {
        if (left[leftKey] === right[rightKey]) {
          matched = true;
          joined.push({ ...left, ...right });
        }
      }

      if (type === "LEFT" && !matched) {
        joined.push({ ...left });
      }
    }

    if (type === "RIGHT") {
      const rightJoined = [];

      for (const right of otherArray) {
        let matched = false;
        for (const left of this.data) {
          if (left[leftKey] === right[rightKey]) {
            matched = true;
            rightJoined.push({ ...left, ...right });
          }
        }
        if (!matched) {
          rightJoined.push({ ...right });
        }
      }

      this.data = rightJoined;
    } else {
      this.data = joined;
    }

    return this;
  }

  query(sql, params = []) {
    let query = sql.trim();
    let paramIndex = 0;

    const selectMatch = query.match(/SELECT\s+(.+?)\s+(WHERE|ORDER BY|LIMIT|$)/i);
    const selectFields = selectMatch ? selectMatch[1].split(',').map(f => f.trim()) : null;

    const whereMatch = query.match(/WHERE\s+(.+?)\s+(ORDER BY|LIMIT|$)/i);
    const whereClause = whereMatch ? whereMatch[1].trim() : null;

    const orderMatch = query.match(/ORDER BY\s+(\w+)\s*(ASC|DESC)?/i);
    const orderKey = orderMatch ? orderMatch[1] : null;
    const orderDir = orderMatch ? orderMatch[2]?.toUpperCase() : 'ASC';

    const limitMatch = query.match(/LIMIT\s+(\d+)/i);
    const limitVal = limitMatch ? parseInt(limitMatch[1]) : null;

    if (whereClause) {
      const tokens = whereClause.split(/\s+(AND|OR)\s+/i);
      const condFns = [];

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.toUpperCase() === 'AND' || token.toUpperCase() === 'OR') {
          condFns.push(token.toUpperCase());
          continue;
        }

        let fn;
        if (/IN\s*\(\s*\?\s*\)/i.test(token)) {
          const [key] = token.split(/\s+IN/i);
          const values = params[paramIndex++];
          fn = row => Array.isArray(values) && values.includes(row[key.trim()]);
        } else if (/NOT\s+IN\s*\(\s*\?\s*\)/i.test(token)) {
          const [key] = token.split(/\s+NOT\s+IN/i);
          const values = params[paramIndex++];
          fn = row => Array.isArray(values) && !values.includes(row[key.trim()]);
        } else if (/BETWEEN\s+\?\s+AND\s+\?/i.test(token)) {
          const [key] = token.split(/\s+BETWEEN/i);
          const min = params[paramIndex++];
          const max = params[paramIndex++];
          fn = row => row[key.trim()] >= min && row[key.trim()] <= max;
        } else if (/LIKE\s+\?/i.test(token)) {
          const [key] = token.split(/\s+LIKE/i);
          const pattern = params[paramIndex++];
          const regex = new RegExp('^' + pattern.replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
          fn = row => regex.test(row[key.trim()]);
        } else {
          const [key, operator] = token.trim().split(/\s+/);
          const val = params[paramIndex++];
          fn = row => this._compare(row[key], operator, val);
        }

        condFns.push(fn);
      }

      this.filter(row => {
        let result = condFns[0](row);
        for (let i = 1; i < condFns.length; i += 2) {
          const logic = condFns[i];
          const nextFn = condFns[i + 1];
          if (logic === 'AND') result = result && nextFn(row);
          if (logic === 'OR') result = result || nextFn(row);
        }
        return result;
      });
    }

    if (orderKey) {
      this.sort((a, b) => {
        const aVal = a[orderKey], bVal = b[orderKey];
        return orderDir === 'DESC' ? bVal - aVal : aVal - bVal;
      });
    }

    if (limitVal !== null) this.limit(limitVal);
    if (selectFields) this.pluckMany(selectFields);

    return this.data;
  }
}
