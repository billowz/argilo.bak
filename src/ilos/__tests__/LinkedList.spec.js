import LinkedList from '../LinkedList'
import {
  filter,
  each
} from '../collection'

describe("LinkedList", () => {

  it("push", () => {
    let list = new LinkedList(),
      arr = []

    for (let i = 0; i < 10; i++) {
      list.push({
        val: i + 1
      })
      arr[i] = i + 1
    }

    expect(list.size()).equal(10)
    expect(list.first().val).equal(1)
    expect(list.last().val).equal(10)
    expect(list.map(v => v.val)).eql(arr)
  })

  it("after", () => {
    let list = new LinkedList(),
      arr = []

    for (let i = 0; i < 10; i++) {
      list.push({
        val: i + 1
      })
      arr[i] = i + 1
    }

    expect(list.size()).equal(10)
    expect(list.first().val).equal(1)
    expect(list.last().val).equal(10)
    expect(list.map(v => v.val)).eql(arr)

    var arr2 = list.toArray(),
      arr3 = []
    for (let i = 0; i < 10; i++) {
      list.after(arr2[i], {
        val: i + 101,
      })
      arr3.push(arr2[i].val, i + 101)
    }
    expect(list.size()).equal(20)
    expect(list.first().val).equal(1)
    expect(list.last().val).equal(110)
    expect(list.map(v => v.val)).eql(arr3)
  })

  it("before", () => {
    let list = new LinkedList(),
      arr = []

    for (let i = 0; i < 10; i++) {
      list.push({
        val: i + 1
      })
      arr[i] = i + 1
    }


    expect(list.size()).equal(10)
    expect(list.first().val).equal(1)
    expect(list.last().val).equal(10)
    expect(list.map(v => v.val)).eql(arr)

    var arr2 = list.toArray(),
      arr3 = []
    for (let i = 0; i < 10; i++) {
      list.before(arr2[i], {
        val: i + 101,
      })
      arr3.push(i + 101, arr2[i].val)
    }
    expect(list.size()).equal(20)
    expect(list.first().val).equal(101)
    expect(list.last().val).equal(10)
    expect(list.map(v => v.val)).eql(arr3)
  })

  it("first", () => {
    let list = new LinkedList(),
      arr = []

    for (let i = 0; i < 10; i++) {
      list.first({
        val: i + 1
      })
      arr[9 - i] = i + 1
    }

    expect(list.size()).equal(10)
    expect(list.first().val).equal(10)
    expect(list.last().val).equal(1)
    expect(list.map(v => v.val)).eql(arr)
  })

  it("remove", () => {
    let list = new LinkedList(),
      arr = []

    for (let i = 0; i < 10; i++) {
      list.push({
        val: i + 1
      })
      arr[i] = i + 1
    }

    expect(list.size()).equal(10)
    expect(list.first().val).equal(1)
    expect(list.last().val).equal(10)
    expect(list.map(v => v.val)).eql(arr)

    arr = filter(arr, v => !(v % 2))
    each(list.filter(v => v.val % 2), v => list.remove(v))

    expect(list.size()).equal(5)
    expect(list.first().val).equal(2)
    expect(list.last().val).equal(10)
    expect(list.map(v => v.val)).eql(arr)
  })

})
