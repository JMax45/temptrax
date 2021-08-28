[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">Temptrax</h3>
</p>

<!-- ABOUT THE PROJECT -->

## About Temptrax

Temptrax is a Node.js module that allows you to generate entries which are valid for a specific amount of time. It was built with Postgresql as the storage but it also has an in-memory support.
Built for [Protonfile](https://www.jz-software.com/web/protonfile/)

### Installation

Install the package with npm

```sh
	npm install temptrax
```

<!-- USAGE EXAMPLES -->

### Usage

```js
import Temptrax from 'temptrax';

const expirationDate = new Date('Sun May 11,2025'); // this entry will expire on May 11, 2025

const temptrax = new Temptrax({
	databaseUrl: 'postgres://username:password@host:5432/dbname',
	tableName: 'temptrax',
	inMemory: false,
});
// databaseUrl and tableName not required if inMemory is true

await temptrax.add('entry_id', { key: 'value' }, expirationDate);

// Get the entry at some later point in time
try {
	const entry = await temptrax.get('entry_id');
} catch (error) {
	// entry is expired or doesn't exist
}
```

<!-- CONTRIBUTING -->

## Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/MyFeature`)
3. Commit your Changes (`git commit -m 'Add MyFeature'`)
4. Push to the Branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- MARKDOWN LINKS -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/JMax45/temptrax?style=for-the-badge
[contributors-url]: https://github.com/JMax45/temptrax/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/JMax45/temptrax?style=for-the-badge
[issues-url]: https://github.com/JMax45/temptrax/issues
[license-shield]: https://img.shields.io/github/license/JMax45/temptrax?style=for-the-badge
[license-url]: https://github.com/JMax45/temptrax/blob/master/LICENSE.txt
