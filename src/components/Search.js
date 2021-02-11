import React from 'react'
import Header from './Header'
import Restaurant from './Restaurant'
import './Search.css'
import { Input, Row, Col } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'
let axios = require('axios')

export default class Search extends React.Component {
	constructor() {
		super()
		this.debounceTimeout = 0
		this.restaurants = []
		this.title = ''
		this.state = {
			filteredRestaurants:
				JSON.parse(window.localStorage.getItem('filteredRestaurants')) || [],
			costFilterChecked:
				window.localStorage.getItem('costFilterChecked') === 'true' || false,
			ratingFilterChecked:
				window.localStorage.getItem('ratingFilterChecked') === 'true' || false,
			noFilterChecked:
				window.localStorage.getItem('noFilterChecked') === 'true' || false,
		}
	}
	/**
	 * @description LifeCycle Method , Invokes when the component mounts
	 * @memberof Search
	 */
	componentDidMount() {
		this.getRequiredFields()
	}

	/**
	 * @description Fetch the restaurant using the api provided by the zomato by using axios method
	 * @memberof Search
	 */
	getRestaurants = async () => {
		let config = {
			method: 'GET',
			url:
				'https://developers.zomato.com/api/v2.1/geocode?lat=12.9039&lon=77.6013',
			headers: {
				'user-key': 'b3bc2811ab683d0742bf9071dda906a5',
			},
		}
		return axios(config)
			.then(function (response) {
				return response.data
			})
			.catch(function (error) {
				console.log(error)
			})
	}

	/**
	 * @description Filters out the unnecessary fiels and will update the class variable with the filteredFields restaurant.
	 * @memberof Search
	 */
	getRequiredFields = async () => {
		let restaurantsList = await this.getRestaurants()
		let requiredFieldsRestaurantList = restaurantsList.nearby_restaurants.map(
			(val) => {
				return {
					cover: val.restaurant.featured_image
						? val.restaurant.featured_image
						: 'https://cdn.dribbble.com/users/189859/screenshots/3639645/abc.gif',
					discount: 30,
					name: val.restaurant.name,
					rating: val.restaurant.user_rating.aggregate_rating,
					reviewCount: parseInt(Math.random() * (9000 - 700) + 700),
					category: val.restaurant.cuisines,
					perPersonCost: val.restaurant.average_cost_for_two / 2,
					deliveryTime: parseInt(Math.random() * (47 - 28) + 28),
					isPromoted: Math.floor(Math.random() * Math.floor(2)),
				}
			}
		)

		this.title = `${restaurantsList.location.title},${restaurantsList.location.city_name}`
		this.restaurants = requiredFieldsRestaurantList
		this.setState({
			filteredRestaurants: [...this.restaurants],
		})
		window.localStorage.setItem(
			'filteredRestaurants',
			JSON.stringify(this.state.filteredRestaurants)
		)
	}
	getRestaurantCard = (restaurant) => {
		return (
			<Col xs={24} sm={12} md={12} xl={8}>
				<Restaurant
					cover={restaurant.cover}
					name={restaurant.name}
					category={restaurant.category}
					cost={restaurant.perPersonCost}
					rating={restaurant.rating}
					deliveryTime={restaurant.deliveryTime}
					isPromoted={restaurant.isPromoted === 1 ? true : false}
					reviewsCount={restaurant.reviewCount}
				/>
			</Col>
		)
	}

	debounceSearch = (event) => {
		let text = event.target.value
		if (this.debounceTimeout) {
			window.clearTimeout(this.debounceTimeout)
		}
		this.debounceTimeout = setTimeout(
			function () {
				this.search(text)
			}.bind(this),
			300
		)
	}

	search = (text) => {
		let restaurantsClone = [...this.restaurants]
		if (text.length === 0) {
			this.setState({
				filteredRestaurants: [...this.restaurants],
			})
			window.localStorage.setItem(
				'filteredRestaurants',
				JSON.stringify(this.state.filteredRestaurants)
			)
			return
		}
		let filteredRestaurants = restaurantsClone.filter((val) => {
			if (
				val.name.toLowerCase().includes(text.toLowerCase()) ||
				val.category.toLowerCase().includes(text.toLowerCase())
			) {
				return true
			}
			if (
				text.toLowerCase() === val.name.toLowerCase() ||
				text.toLowerCase() === val.category.toLowerCase()
			) {
				return true
			}
			return false
		})
		this.setState({
			filteredRestaurants: [...filteredRestaurants],
		})
		window.localStorage.setItem(
			'filteredRestaurants',
			JSON.stringify(this.state.filteredRestaurants)
		)
	}

	isChecked = (e) => {
		let restaurantsToBeSorted = []
		if (e.target.id === 'costFilter') {
			window.localStorage.setItem('costFilterChecked', true)
			window.localStorage.setItem('ratingFilterChecked', false)
			window.localStorage.setItem('noFilterChecked', false)
			this.setState({
				costFilterChecked: true,
				ratingFilterChecked: false,
				noFilterChecked: false,
			})
			restaurantsToBeSorted = [...this.state.filteredRestaurants]
			restaurantsToBeSorted.sort((a, b) => {
				if (a.perPersonCost > b.perPersonCost) {
					return 1
				}
				return -1
			})
		} else if (e.target.id === 'ratingFilter') {
			window.localStorage.setItem('costFilterChecked', false)
			window.localStorage.setItem('ratingFilterChecked', true)
			window.localStorage.setItem('noFilterChecked', false)
			this.setState({
				ratingFilterChecked: true,
				costFilterChecked: false,
				noFilterChecked: false,
			})
			restaurantsToBeSorted = [...this.state.filteredRestaurants]
			restaurantsToBeSorted.sort((a, b) => {
				if (a.rating > b.rating) {
					return -1
				}
				return 1
			})
		} else {
			window.localStorage.setItem('costFilterChecked', false)
			window.localStorage.setItem('ratingFilterChecked', false)
			window.localStorage.setItem('noFilterChecked', true)
			this.setState({
				noFilterChecked: true,
				costFilterChecked: false,
				ratingFilterChecked: false,
			})
			restaurantsToBeSorted = [...this.state.filteredRestaurants]
			restaurantsToBeSorted.sort((a, b) => {
				if (a.name > b.name) {
					return 1
				}
				return -1
			})
		}
		this.setState({
			filteredRestaurants: [...restaurantsToBeSorted],
		})
		window.localStorage.setItem(
			'filteredRestaurants',
			JSON.stringify(this.state.filteredRestaurants)
		)
	}

	render() {
		return (
			<div>
				<Header>
					<Input.Search
						placeholder="Search for restaurant, cuisine or a dish..."
						allowClear
						enterButton="Search"
						size="large"
						onSearch={this.search}
						onChange={this.debounceSearch}
					/>
					<a href="https://github.com/twentyonedot/xomato" target="_blank">
						<GithubOutlined style={{ fontSize: '35px', color: '#333' }} />
					</a>
				</Header>
				<Row justify="center">
					<Col xs={{ span: 24 }} md={{ span: 20 }}>
						<div className="filter-container ">
							<label>
								<input
									id="costFilter"
									type="radio"
									name="filter"
									checked={this.state.costFilterChecked}
									onChange={this.isChecked}
								/>
								<span className="checkedContent">
									&#8645; Cost: Low to High
								</span>
							</label>
							<label>
								<input
									id="noFilter"
									type="radio"
									name="filter"
									checked={this.state.noFilterChecked}
									onChange={this.isChecked}
								/>
								<span className="checkedContent">No Filters</span>
							</label>
							<label>
								<input
									id="ratingFilter"
									type="radio"
									name="filter"
									checked={this.state.ratingFilterChecked}
									onChange={this.isChecked}
								/>
								<span className="checkedContent">
									&#8645; Rating: High to Low
								</span>
							</label>
						</div>
					</Col>
				</Row>

				<Row justify="center">
					<h1 className="title">{this.title}</h1>
					<Col xs={{ span: 24 }} md={{ span: 20 }}>
						<div className="search-container ">
							<Row justify="space-around">
								{this.restaurants.length !== 0
									? this.state.filteredRestaurants.map((restaurant) =>
											this.getRestaurantCard(restaurant)
									  )
									: ''}
							</Row>
						</div>
					</Col>
				</Row>
			</div>
		)
	}
}
