# chiVuolEssereMilionario

This is an interactive implementation of the tv show Who wants to be a Billionaire?

Questions are placed as a js object in the index.html file.

KEYS to control the app:

- [RIGHT ARROW] Next step or question
- [DOWN ARROW]  Show next answer
- [A,B,C,D]     Highlight selected option
- [Y]           Mark selected answer as correct
- [N]           Mark selected answer as wrong
- [F]           Switch between camera and static background image
- [P]           Psycho mode: flashing camera

After an answer is set to wrong, another one can be selected if desired.

Sample question:
{
  question: "Chi era il primo ministro italiano nel lontano 1994?",
  options: [
    "Silvio",
    "Berlusconi",
    "Silvio Berlusconi Berlusconi Berlusconi Berlusconi Berlusconi",
    "Il Cavaliere"
  ],
  image:"img/logo.png"
}

The `image` parameter can be omitted.

Will update this README with new features. There already are some still undocumented features, I hope to find the time to document them soon.

See index.html for an example data and library init.
