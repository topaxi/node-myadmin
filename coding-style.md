node-myadmin coding style
=========================

## DESCRIPTION

The node-myadmin coding style is based on @isaacs npm coding style.

## Line Length

Keep lines shorter than 80 characters.  It's better for lines to be
too short than to be too long.  Break up long lists, objects, and other
statements onto multiple lines.

## Indentation

Two-spaces.  Tabs are better, but they look like hell in web browsers
(and on github), and node uses 2 spaces, so that's that.

Configure your editor appropriately.

## Curly braces

Curly braces belong on the same line as the thing that necessitates them.

Bad:

    function ()
    {

Good:

    function () {

If a block needs to wrap to the next line, use a curly brace.  Don't
use it if it doesn't.

Bad:

    if (foo) { bar() }
    while (foo)
      bar()

Good:

    if (foo) bar()
    while (foo) {
      bar()
    }

## Cuddling braces

Do not cuddle braces. It helps to show where each block starts or ends.

Bad:

    if (foo) {
      try {
        bar()
      } catch (e) {
        return false
      } finally {
        foo.end()
      }
    } else {
      baz()
    }

    return true

Good:

    if (foo) {
      try {
        bar()
      }
      catch (e) {
        return false
      }
      finally {
        foo.end()
      }
    }
    else {
      baz()
    }

    return true

## Semicolons

Don't use them except in four situations:

* `for (;;)` loops.  They're actually required.
* null loops like: `while (something) ;` (But you'd better have a good
  reason for doing that.)
* case "foo": doSomething(); break
* In front of a leading ( or [ at the start of the line.
  This prevents the expression from being interpreted
  as a function call or property access, respectively.

Some examples of good semicolon usage:

    ;(x || y).doSomething()
    ;[a, b, c].forEach(doSomething)
    for (var i = 0; i < 10; i ++) {
      switch (state) {
        case "begin": start(); continue
        case "end": finish(); break
        default: throw new Error("unknown state")
      }
      end()
    }

Note that starting lines with `-` and `+` also should be prefixed
with a semicolon, but this is much less common.

## Comma First

If there is a list of things separated by commas, and it wraps
across multiple lines, put the comma at the start of the next
line, directly below the token that starts the list.  Put the
final token in the list on a line by itself.  For example:

    var magicWords = [ "abracadabra"
                     , "gesundheit"
                     , "ventrilo"
                     ]
      , spells = { "fireball" : function () { setOnFire() }
                 , "water" : function () { putOut() }
                 }
      , a = 1
      , b = "abc"
      , etc
      , somethingElse

## Whitespace

Put a single space in front of ( for anything other than a function definition and call.

Bad:

    function foo (bar) { }

    foo ()

Good:

    function foo(bar) { }

    foo()

Also use a single space wherever it makes things more readable.

Don't leave trailing whitespace at the end of lines.  Don't indent empty
lines.  Don't use more spaces than are helpful.

## Functions

Use named functions. They make stack traces a lot easier to read.

## Callbacks, Sync/async Style

Use the asynchronous/non-blocking versions of things as much as possible.
It might make more sense for npm to use the synchronous fs APIs, but this
way, the fs and http and child process stuff all uses the same callback-passing
methodology.

The callback should always be the last argument in the list.  Its first
argument is the Error or null.

Be very careful never to ever ever throw anything.  It's worse than useless.
Just send the error message back as the first argument to the callback.

## Errors

Always create a new Error object with your message.  Don't just return a
string message to the callback.  Stack traces are handy.

## Case, naming, etc.

Use lowerCamelCase for multiword identifiers when they refer to objects,
functions, methods, members, or anything not specified in this section.

Use UpperCamelCase for class names (things that you'd pass to "new").

Use all-lower-hyphen-css-case for multiword filenames and config keys.

Use named functions.  They make stack traces easier to follow.

Use CAPS_SNAKE_CASE for constants, things that should never change
and are rarely used.

Use a single uppercase letter for function names where the function
would normally be anonymous, but needs to call itself recursively.  It
makes it clear that it's a "throwaway" function.

## null, undefined, false, 0

Boolean variables and functions should always be either `true` or
`false`.  Don't set it to 0 unless it's supposed to be a number.

When something is intentionally missing or removed, set it to `null`.

Don't set things to `undefined`.  Reserve that value to mean "not yet
set to anything."

Boolean objects are verboten.
