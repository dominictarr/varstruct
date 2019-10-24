var varstruct = require('../')
var test = require('tape').test

var fixtures = [
  {
    description: 'Array',
    type: varstruct.Array(2, varstruct.String(3)),
    length: 6,
    values: [
      [['foo', 'bar'], '666f6f626172']
    ],
    invalid: {
      encode: [
        ['foobar', /^TypeError: Expected Array, got String foobar$/],
        [1, /^TypeError: Expected Array, got Number 1$/],
        [Buffer.alloc(3), /^TypeError: Expected Array, got Buffer/],
        [['foo', 'bar', 'baz'], /^TypeError: Expected Array(Length: 2), got Array(Length: 3)/],
        [['foo'], /^TypeError: Expected Array(Length: 2), got Array(Length: 1)/],
        [undefined, /^TypeError: Expected Array, got undefined/]
      ],
      decode: [
        [Buffer.from('0000'), /^RangeError: data too short$/]
      ]
    }
  }
]

fixtures.forEach(function (f) {
  f.values.forEach(function (fv) {
    var before = fv[0]
    var after = fv[1]
    var bytes = after.length / 2

    test(f.description + ' encodes/decodes ' + JSON.stringify(f.before), function (t) {
      t.plan(7)

      t.same(f.type.encodingLength(before), bytes, 'encodingLength is OK')

      var encoded = f.type.encode(before)
      var decoded = f.type.decode(Buffer.from(after, 'hex'))

      t.same(encoded.toString('hex'), after, 'encode OK')
      t.same(f.type.encode.bytes, bytes)

      t.same(decoded, before, 'decode OK')
      t.same(f.type.decode.bytes, bytes)

      decoded = f.type.decode(Buffer.from(after + 'ffff', 'hex'))
      t.same(decoded, before, 'OK w/ extra data')
      t.same(f.type.decode.bytes, bytes)

      t.throws(function () {
        decoded = f.type.decode(Buffer.from(after, 'hex'), 3 /* offset */)
      }, /^RangeError: data too short$/)
    })
  })

  f.invalid.encode.forEach(function (fv) {
    test(f.description + ' fails to encode ' + JSON.stringify(fv[0]), function (t) {
      t.plan(1)
      t.throws(function () {
        f.type.encode(fv[0])
      }, fv[1])
    })

    test(f.description + ' fails to decode ' + JSON.stringify(fv[0]), function (t) {
      t.plan(1)
      t.throws(function () {
        f.type.decode(fv[0])
      }, fv[1])
    })
  })

  if (f.length !== undefined) {
    test(f.description + ' has a constant length (' + f.length + ')', function (t) {
      t.plan(1)
      t.same(f.length, f.type.encodingLength(), 'constant length (no parameters required)')
    })
  }
})
