x       | y       | x&y     | x\|y
--------|---------|---------|-------------
`true`  | `true`  | `true`  | `true`
`true`  | `false` | `false` | `true`
`true`  | `null`  | `null`  | `null`
`false` | `true`  | `false` | `true`
`false` | `false` | `false` | `false`
`false` | `null`  | `false` | `null`
`null`  | `true`  | `null`  | `true`
`null`  | `false` | `false` | `null`
`null`  | `null`  | `null`  | `null`
f\|oo   |         |         |
        |         |         | b **\|** im