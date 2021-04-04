
hello world
|  Type |             Range |                     Size |
|------:|------------------:|-------------------------:|
| sbyte |       -128 to 127 |     Signed 8-bit integer |
|  byte |          0 to 255 |   Unsigned 8-bit integer |
|  char |  U+0000 to U+ffff | Unicode 16-bit character |
| short | -32,768 to 32,767 |    Signed 16-bit integer |
<!-- markdown-table-prettify-ignore-start -->
|ushort|0 to 65,535|Unsigned 16-bit integer|
|int|-2,147,483,648 to 2,147,483,647|Signed 32-bit integer|
|uint|0 to 4,294,967,295|Unsigned 32-bit integer|
|long|-9,223,372,036,854,775,808 to 9,223,372,036,854,775,807|Signed 64-bit integer|
|ulong|0 to 18,446,744,073,709,551,615|Unsigned 64-bit integer|

Type | Range|	Size
-|-|-
sbyte |	-128 `|to|` 127|	Signed 8-bit integer
byte|	0 `|to|` 255|	Unsigned 8-bit integer
char|	U+0000 `|to|` U+ffff|	Unicode 16-bit character
short|	-32,768 `|to|` 32,767|	Signed 16-bit integer
ushort|	0 `|to|` 65,535|	Unsigned 16-bit integer
int|	-2,147,483,648 `|to|` 2,147,483,647|	Signed 32-bit integer
uint|	0 `|to|` 4,294,967,295|	Unsigned 32-bit integer
long|	-9,223,372,036,854,775,808 `|to|` 9,223,372,036,854,775,807|	Signed 64-bit integer
ulong|	0 `|to|` 18,446,744,073,709,551,615|	Unsigned 64-bit integer

Type | Range|
-|-|
sbyte |	-128 `|to|` 127|
byte|	0 `|to|` 255|
char|	U+0000 `|to|` U+ffff|
<!-- markdown-table-prettify-ignore-start -->
short|	-32,768 `|to|` 32,767|
ushort|	0 `|to|` 65,535|
int|	-2,147,483,648 `|to|` 2,147,483,647|
uint|	0 `|to|` 4,294,967,295|
<!-- markdown-table-prettify-ignore-end -->
long|	-9,223,372,036,854,775,808 `|to|` 9,223,372,036,854,775,807|
ulong|	0 `|to|` 18,446,744,073,709,551,615|
Type   |   | Range                           | Size
-------|---|---------------------------------|-------------------------
sbyte  |   | -128 to 127                     | Signed 8-bit integer
byte   |   | 0 to 255                        | Unsigned 8-bit integer
char   |   | U+0000 to U+ffff                | Unicode 16-bit character
short  |   | -32,768 to 32,767               | Signed 16-bit integer
ushort |   | 0 to 65,535                     | Unsigned 16-bit integer
int    |   | -2,147,483,648 to 2,147,483,647 | Signed 32-bit integer
uint   |   | 0 to 4,294,967,295              | Unsigned 32-bit integer

# This should be formatted

| Column A | Column B |
|----------|----------|
| Foo      | Bar      |

# This should not be formatted

<!-- markdown-table-prettify-ignore-start -->
| Column A | Column B |
|---|---|
| Foo | Bar |
<!-- markdown-table-prettify-ignore-end -->

# This should be formatted again

| Column A | Column B |
|----------|----------|
| Foo      | Bar      |