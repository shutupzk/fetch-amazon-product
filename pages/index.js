import React, { Component } from 'react'
import axios from 'axios'
import { Input } from 'antd'
const { Search } = Input

export default class extends Component {
  constructor() {
    super()
    this.state = {
      asin: '',
      title: '',
      category: '',
      rank: [],
      productDimensions: ''
    }
  }

  render() {
    const { asin, title, category, rank, productDimensions } = this.state
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Amazon product</h1>
        <div style={{ width: '500px' }}>
          <Search
            placeholder="input Amazon product ASIN"
            enterButton="Search"
            size="large"
            onSearch={async value => {
              try {
                const data = await axios.get('http://127.0.0.1:3000/api/fetch/' + value)
                if (data.status != 200) {
                  console.log(data.statusText)
                  return
                }

                console.log(data)
                const { code, msg, asin, title, category, rank = [], productDimensions } = data.data
                if (code == 200) {
                  this.setState({
                    asin,
                    title,
                    category,
                    rank,
                    productDimensions
                  })
                }
                console.log(code, msg)
              } catch (error) {
                console.log(error)
              }

            }}
          />
        </div>
        <div style={{ width: '600px', display: 'flex', flexDirection: 'column', marginTop: '50px' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
            <h2 style={{ color: '#b7b7b7', width: '250px' }}>{`title: `}</h2>
            <h2 style={{ flex: 1 }}>{title}</h2>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
            <h2 style={{ color: '#b7b7b7', width: '250px' }}>{`productDimensions: `}</h2>
            <h2 style={{ flex: 1 }}>{productDimensions}</h2>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
            <h2 style={{ color: '#b7b7b7', width: '250px' }}>{`category: `}</h2>
            <h2 style={{ flex: 1 }}>{category}</h2>
          </div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
            <h2 style={{ color: '#b7b7b7', width: '250px' }}>{`rank: `}</h2>
            <div style={{ flex: 1 }}>
              {
                rank.map(({ rank, ladder }, index) => {
                  return <h2 key={index}>{`#${rank}  ${ladder}`}</h2>
                })
              }
            </div>

          </div>
        </div>

      </div>
    )
  }
}
