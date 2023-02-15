import './App.css';
import './assets/images/famfamfam/style.css';
import iconList from './assets/images/famfamfam/icons.json';
import { Component } from 'react';

const regexSymbols = /[\s_,.-]+/;
let searchDelay = undefined;

class App extends Component {
	constructor(props) {
		super(props);

		this.onInputSearch = this.onInputSearch.bind(this);
		this.updateSearch = this.updateSearch.bind(this);
		this.onClickIcon = this.onClickIcon.bind(this);
		this.fetchData = this.fetchData.bind(this);

		this.text = '';

		this.state = {
			items: [],
			stopFetch: false,
		};
	}

	fetchData(force = false) {
		if (this.state.stopFetch === true) return;
		if (this.text && this.text.length > 0) return;

		const scrollHeight = window.innerHeight + window.scrollY;
		const offsetHeight = document.documentElement.scrollHeight;
		const itemsPerPage = Math.round(window.innerHeight / 4);

		if (force === true || scrollHeight >= offsetHeight) {
			const currentPage = Math.ceil(Math.max(1, offsetHeight / window.innerHeight));

			this.setState({
				items: [...iconList].slice(0, currentPage * itemsPerPage),
				stopFetch: true,
			});
		}
	}

	componentDidMount() {
		this.fetchData();
		window.addEventListener('scroll', this.fetchData);
		window.addEventListener('resize', this.fetchData);
	}

	componentDidUpdate() {
		this.state.stopFetch = false;
	}

	onInputSearch(ev) {
		ev.stopPropagation();

		this.text = ev.target.value;

		if (searchDelay) clearTimeout(searchDelay);
		searchDelay = setTimeout(this.updateSearch, 300);
	}

	updateSearch() {
		const text = this.text;

		if (text.length < 2) {
			if (text.length === 0) this.fetchData(true);
			return;
		}

		let filter = [];
		const icons = [];

		let words = text.split(regexSymbols);
		let regexNew = words.shift();

		for (const key in words) regexNew += '[-|_]' + words[key];
		regexNew = new RegExp(regexNew, 'i');

		for (const key in iconList) {
			const value = iconList[key];

			if (filter[value]) continue;

			if (regexNew.test(value)) {
				filter[value] = true;
				icons.push(value);
			}
		}

		filter = regexNew = words = null;
		if (icons.length > 0) this.setState({ items: [...icons] });
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.fetchData);
		window.removeEventListener('resize', this.fetchData);
		if (searchDelay) clearTimeout(searchDelay);
	}

	onClickIcon(ev) {
		ev.stopPropagation();

		const target = ev.target;
		const parent = target.parentElement;
		let title = target.title ?? '';

		if ((!title || title.length === 0) && parent.className !== 'icons-container') title = parent.title;
		if (title.length !== 0) navigator.clipboard.writeText(title);
	}

	render() {
		return (
			<div className="container">
				<div className="search-container">
					<input
						type="search"
						autoComplete="off"
						placeholder="user-gray"
						onInput={this.onInputSearch}
					></input>
				</div>

				{this.state.items.length !== 0 && (
					<div className="icons-container" onClick={this.onClickIcon}>
						{this.state.items.map((value, idx) => (
							<div key={value} title={value}>
								<div className={'icon ' + value}></div>
								<span>{value}</span>
							</div>
						))}
					</div>
				)}
			</div>
		);
	}
}

export default App;
