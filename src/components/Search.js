import React from 'react'
import Header from './Header'
import { Input } from 'antd'
import './Search.css'
import { GithubOutlined, GithubOutlinedTwoTone } from '@ant-design/icons'
import Restaurant from './Restaurant'
import 'antd/dist/antd.css'
import { Row, Col } from 'antd'

let axios = require('axios')

export default class Search extends React.Component {
	constructor() {
		super()
		this.debounceTimeout = 0
		this.restaurants = []
		this.title = ''
		this.state = {
			loading: false,
			filteredRestaurants: [],
		}
	}
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

	getRequiredFields = async () => {
		let restaurantsList = await this.getRestaurants()
		/* console.log(restaurantsList) */
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
		/* console.log(requiredFieldsRestaurantList) */
		this.title = `${restaurantsList.location.title},${restaurantsList.location.city_name}`
		/* console.log(this.title) */
		this.restaurants = requiredFieldsRestaurantList
		this.setState({
			filteredRestaurants: [...this.restaurants],
		})
	}
	getRestaurantCard = (restaurant) => {
		console.log(restaurant)
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
	componentDidMount() {
		this.getRequiredFields()
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
	}

	render() {
		return (
			<>
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
			</>
		)
	}
}
