import React from 'react'
import './Restaurant.css'

export default class Restaurant extends React.Component {
	/**
	 * @description Visualization for Rating
	 * @param {*} rating
	 * @memberof Restaurant
	 */
	greyOrRedStar = (isGoodStar) => {
		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill={isGoodStar >= 1 ? '#E23744' : ' #cfcfcf'}
				width="18"
				height="18"
				viewBox="0 0 20 20"
			>
				<path d="M16.6667 0H3.33333C1.5 0 0 1.5 0 3.33333V16.6667C0 18.5 1.5 20 3.33333 20H16.6667C18.5 20 20 18.5 20 16.6667V3.33333C20 1.5 18.5 0 16.6667 0ZM16.6667 8.75L13.5833 11.5L14.5 15.5833C14.5833 15.9167 14.5 16.1667 14.25 16.4167C14.1667 16.5 14 16.5833 13.8333 16.5833C13.6667 16.5833 13.5833 16.5833 13.4167 16.5L10 14.25L6.58333 16.3333C6.33333 16.5 6 16.5 5.75 16.3333C5.5 16.1667 5.41667 15.8333 5.5 15.5L6.41667 11.5L3.33333 8.75C3.08333 8.5 3 8.25 3.08333 7.91667C3.16667 7.66667 3.41667 7.41667 3.75 7.41667L7.75 7L9.33333 3.16667C9.41667 3 9.58333 2.83333 9.75 2.75C10.0833 2.58333 10.5833 2.75 10.6667 3.16667L12.25 7L16.25 7.33333C16.5833 7.33333 16.8333 7.58333 16.9167 7.83333C17 8.16667 16.9167 8.5 16.6667 8.75Z"></path>
			</svg>
		)
	}

	/**
	 * @description renders the Single Restaurant component
	 * @returns {*}
	 * @memberof Restaurant
	 */
	render() {
		return (
			<div className="container">
				<div className="card">
					<div className="card-image-div">
						<img className="card-image" src={this.props.cover} alt="" />
					</div>
					<div className="card-text">
						<div className="section-1">
							<p className="card-title">{this.props.name}</p>
						</div>
						<div className="section-2">
							<span className="stars">
								{this.greyOrRedStar(this.props.rating / 1)}
								{this.greyOrRedStar(this.props.rating / 2)}
								{this.greyOrRedStar(this.props.rating / 3)}
								{this.greyOrRedStar(this.props.rating / 4)}
								{this.greyOrRedStar(this.props.rating / 5)}
								<span className="rating">{this.props.rating}</span>
							</span>
							<span className="reviews">
								{' '}
								({this.props.reviewsCount.toLocaleString()} Delivery Reviews){' '}
							</span>
						</div>
						<div className="section-3">
							<p className="category">{this.props.category}</p>
						</div>
						<div className="section-4">
							<p>
								<span>₹{this.props.cost} per person</span>
								<span className="dot">&bull;</span>
								{this.props.deliveryTime} min
							</p>
						</div>
						<div className="section-5">
							<p>{this.props.isPromoted === true ? 'Promoted' : ''}</p>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
