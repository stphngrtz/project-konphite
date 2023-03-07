# Documentation
Dummy documentation to use tools like [AsciiDoc](https://asciidoctor.org/) or [PlantUML](https://plantuml.com/) and create a deployment pipeline to [GitHub Pages](https://pages.github.com/).

```bash
# create documentation
../gradlew :documentation:asciidoctor

# open documentation
open build/docs/asciidoc/index.html
```

## Ingredients
List of things I've (more or less) used for the first time during project implenmentation.

- [AsciiDoc](https://asciidoctor.org/)

  I'm a [Markdown](https://en.wikipedia.org/wiki/Markdown) user since its early days and never felt the need for something else. But since it is always a good idea to have at least some basic understanding of well known tools like AsciiDoc, I've decided to use this instead for this small and simple dummy documentation.

- [PlantUML](https://plantuml.com/)

  To define UML diagrams with a simple and intuitive language sounds interesing enough to give it a try. It definetly has its shortcomings compared to a graphical editor where you can draw boxes and lines wherever you want, but in general the result is pretty impressive. I'm definitely going to use it more often in the future.

- [C4](https://c4model.com/)

  C4 is an easy to learn, developer friendly approach to visualising software architecture. But why, we already have UML, you may ask. The argument of the C4 creators is that UML too heavy, the notation is too complex. With that, they have a point.

- [GitHub Pages](https://pages.github.com/)

  I've never hosted anything on GitHub Pages nor did I set up a deployment pipeline to automate deploying changes to it. Wow, was about time! I haven't expected anything but a flawless experience and this is exactly what I got.
