**Note:** This repository is a work-in-progress to provide architecture for future WCAG 3 work.

See https://github.com/w3c/wcag3 for the canonical WCAG 3 repository.

## Architecture Status

- Normative document infrastructure:
  - [x] Groups, Guidelines, Requirements
  - [x] Acknowledgements
  - [ ] Key Terms
- [ ] Porting existing data from current Editor's Draft
- [ ] Informative docs infrastructure (methods, etc.) - pending design
- Feature parity with `w3c/wcag` build system:
  - [ ] `WCAG_MODE` (and related variables)
  - [ ] `WCAG_VERSION` (and version metadata in general)

## Setup

Make sure you have Node.js installed. This has primarily been tested with v20,
the current LTS at time of writing.

If you use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to manage multiple Node.js versions,
you can switch to the recommended version by typing `fnm use` or `nvm use`
(with no additional arguments) while in the repository directory.

Otherwise, you can download an installer from [nodejs.org](https://nodejs.org/).

First, run `npm i` in the root directory of the repository to install dependencies.

## Project Structure

This repository uses Astro;
see [Astro's guide on project structure](https://docs.astro.build/en/basics/project-structure/)
for standard directories.

Additional directories with special meaning in this repository:

- `guidelines/` - contains content files which compose the normative and informative documents
  - `acknowledgements/` - Contents of Acknowledgement sections, one section per file
    - `index.json` - Defines order of Acknowledgements sections
  - `groups/` - Contents of grouping sections
    - `index.json` - Defines order of grouping sections
    - `{group-name}/` - Contents of Guideline sections
      - `index.json` - Defines order of guideline sections
      - `{guideline-name}.md` - Defines content of guideline and order of its requirements/assertions
      - `{guideline-name}/` - Subdirectory containing requirements/assertions under each guideline
        - `{requirement-or-assertion-name}.md` - Defines content of an individual requirement or assertion

In the case of files or directories representing groups, guidelines, or requirements/assertions,
each entity's title is based on its slug by default, i.e. hyphens are replaced by spaces, and
the first letter of the first word is capitalized. This can be customized by overriding the
`title` field, which exists in `index.json` for groups, or in Markdown frontmatter for
guidelines, requirements, or assertions.

## Common Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm start`               | Start local dev server at `localhost:4321`       |
| `npm run build`           | Build to `./dist/`                               |
| `npm run check`           | Check for TypeScript errors                      |
| `npm run preview`         | Preview build locally at `localhost:4321`        |

## Environment Variables

### `WCAG_DIFFABLE`

Filters build output to reduce noise when diffing output between changes.
This is for maintenance purposes only, to catch regressions;
built code is not expected to run properly when this is active!

**Default:** Unset (set to any non-empty value to enable)
