* Single tab
	Type  | Range            | Size
	------|------------------|-------------------------
	sbyte | -128 to 127      | Signed 8-bit integer
	byte  | 0 to 255         | Unsigned 8-bit integer
	char  | U+0000 to U+ffff | Unicode 16-bit character
* Two tabs
		Type  | Range            | Size
		------|------------------|-------------------------
		sbyte | -128 to 127      | Signed 8-bit integer
		byte  | 0 to 255         | Unsigned 8-bit integer
		char  | U+0000 to U+ffff | Unicode 16-bit character
* Mixed tabs and spaces, but more tab
	Type  | Range            | Size
	------|------------------|-------------------------
	sbyte | -128 to 127      | Signed 8-bit integer
	byte  | 0 to 255         | Unsigned 8-bit integer
	char  | U+0000 to U+ffff | Unicode 16-bit character
* Left aligned
	Type  | Range            | Size
	:-----|:-----------------|:------------------------
	sbyte | -128 to 127      | Signed 8-bit integer
	byte  | 0 to 255         | Unsigned 8-bit integer
	char  | U+0000 to U+ffff | Unicode 16-bit character
* Right aligned
	 Type |            Range |                     Size
	-----:|-----------------:|------------------------:
	sbyte |      -128 to 127 |     Signed 8-bit integer
	 byte |         0 to 255 |   Unsigned 8-bit integer
	 char | U+0000 to U+ffff | Unicode 16-bit character
* Center aligned
	 Type | Range            |           Size
	:----:|:-----------------|:-----------------------:
	sbyte | -128 to 127      |   Signed 8-bit integer
	 byte | 0 to 255         |  Unsigned 8-bit integer
	 char | U+0000 to U+ffff | Unicode 16-bit character
* Already right aligned should remain untouched
	 Type |            Range |                     Size
	-----:|-----------------:|------------------------:
	sbyte |      -128 to 127 |     Signed 8-bit integer
	 byte |         0 to 255 |   Unsigned 8-bit integer
	 char | U+0000 to U+ffff | Unicode 16-bit character
* Already center aligned should remain untouched
	 Type | Range            |           Size
	:----:|:-----------------|:-----------------------:
	sbyte | -128 to 127      |   Signed 8-bit integer
	 byte | 0 to 255         |  Unsigned 8-bit integer
	 char | U+0000 to U+ffff | Unicode 16-bit character