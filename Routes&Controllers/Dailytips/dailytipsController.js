import request from "request-promise"

//Array of health tip IDs
const numbers = [
    25, 327, 329, 350, 510, 512, 514, 527, 528, 529, 530, 531, 532, 533, 534, 536,
    537, 538, 539, 540, 541, 542, 543, 544, 546, 547, 549, 551, 552, 553,
    30530, 30531, 30532, 30533, 30534
]

//Function to return 6 random healthtips
function getRandomNumbers(array, count) {
    const result = [];
    const totalNumbers = array.length;
    
    // Generate 'count' unique random indices
    while (result.length < count) {
        const randomIndex = Math.floor(Math.random() * totalNumbers)
        if (!result.includes(randomIndex)) {
            result.push(randomIndex)
        }
    }
    
    // Pick numbers corresponding to the random indices
    return result.map(index => array[index]);
}

// @desc    Get 6 random tips for homepage
// @route   GET /dailyTips/tips
// @returns Object of 6 tips with ImageUrl, id and title
// @access  Public
export const getRandomTips = async (req, res) => {
    const randomNumbers = getRandomNumbers(numbers, 6);
  try{
    const apiUrl1 = `https://health.gov/myhealthfinder/api/v3/topicsearch.json?TopicId=${randomNumbers[0]}`
    const apiUrl2 = `https://health.gov/myhealthfinder/api/v3/topicsearch.json?TopicId=${randomNumbers[1]}`
    const apiUrl3 = `https://health.gov/myhealthfinder/api/v3/topicsearch.json?TopicId=${randomNumbers[2]}`
    const apiUrl4 = `https://health.gov/myhealthfinder/api/v3/topicsearch.json?TopicId=${randomNumbers[3]}`
    const apiUrl5 = `https://health.gov/myhealthfinder/api/v3/topicsearch.json?TopicId=${randomNumbers[4]}`
    const apiUrl6 = `https://health.gov/myhealthfinder/api/v3/topicsearch.json?TopicId=${randomNumbers[5]}`

    // Fetch data from all 6 URLs simultaneously
    const [data1, data2, data3, data4, data5, data6] = await Promise.all([
      request({ uri: apiUrl1, json: true }),
      request({ uri: apiUrl2, json: true }),
      request({ uri: apiUrl3, json: true }),
      request({ uri: apiUrl4, json: true }),
      request({ uri: apiUrl5, json: true }),
      request({ uri: apiUrl6, json: true })
    ]);

    // const dataPackage1 = {
      // imageUrl: data1.Result.Resources.Resource[0].ImageUrl,
      // id: data1.Result.Resources.Resource[0].Id,
      // title: data1.Result.Resources.Resource[0].Title
    // }

    // const dataPackage2 = {
    //   imageUrl: data2.Result.Resources.Resource[0].ImageUrl,
    //   id: data2.Result.Resources.Resource[0].Id,
    //   title: data2.Result.Resources.Resource[0].Title
    // }

    // const dataPackage3 = {
    //   imageUrl: data3.Result.Resources.Resource[0].ImageUrl,
    //   id: data3.Result.Resources.Resource[0].Id,
    //   title: data3.Result.Resources.Resource[0].Title
    // }

    // const dataPackage4 = {
    //   imageUrl: data4.Result.Resources.Resource[0].ImageUrl,
    //   id: data4.Result.Resources.Resource[0].Id,
    //   title: data4.Result.Resources.Resource[0].Title
    // }

    // const dataPackage5 = {
    //   imageUrl: data5.Result.Resources.Resource[0].ImageUrl,
    //   id: data5.Result.Resources.Resource[0].Id,
    //   title: data5.Result.Resources.Resource[0].Title
    // }

    // const dataPackage6 = {
    //   imageUrl: data6.Result.Resources.Resource[0].ImageUrl,
    //   id: data6.Result.Resources.Resource[0].Id,
    //   title: data6.Result.Resources.Resource[0].Title
    // }

    const dataPackage = [
      {
        imageUrl: data1.Result.Resources.Resource[0].ImageUrl,
        id: data1.Result.Resources.Resource[0].Id,
        title: data1.Result.Resources.Resource[0].Title
      },
      {
        imageUrl: data2.Result.Resources.Resource[0].ImageUrl,
        id: data2.Result.Resources.Resource[0].Id,
        title: data2.Result.Resources.Resource[0].Title
      },
      {
        imageUrl: data3.Result.Resources.Resource[0].ImageUrl,
        id: data3.Result.Resources.Resource[0].Id,
        title: data3.Result.Resources.Resource[0].Title, 
      },
      {
        imageUrl: data4.Result.Resources.Resource[0].ImageUrl,
        id: data4.Result.Resources.Resource[0].Id,
        title: data4.Result.Resources.Resource[0].Title, 
      },
      {
        imageUrl: data5.Result.Resources.Resource[0].ImageUrl,
        id: data5.Result.Resources.Resource[0].Id,
        title: data5.Result.Resources.Resource[0].Title, 
      },
      { 
        imageUrl: data6.Result.Resources.Resource[0].ImageUrl,
        id: data6.Result.Resources.Resource[0].Id,
        title: data6.Result.Resources.Resource[0].Title, 
      }
    ]
     
    res.json({data: dataPackage})
  }catch(err){
    res.status(500).json({message: `Error fetching data from API: ${err}`})
  }
}

// @desc    Get single tip
// @route   GET /dailyTips/tip/:id
// @returns Object of content, lastupdated, imageurl and imagealt
// @access  Public
export const getSingleTip =  (req, res) => {

    const apiUrl = `https://health.gov/myhealthfinder/api/v3/topicsearch.json?TopicId=${req.params.id}`
  
    request(apiUrl, (error, response, body) => {
      if (error) {
        res.status(500).json({message: `Error fetching data from API: ${error}`})
      } else {
        // Parse the JSON response body and send it
        const data = JSON.parse(body)

        const mainTitle =  data.Result.Resources.Resource[0].Title
        const imageAlt = data.Result.Resources.Resource[0].ImageAlt
        const imageUrl = data.Result.Resources.Resource[0].ImageUrl
        const lastUpdatedDate = new Date(parseInt(data.Result.Resources.Resource[0].LastUpdate)).toLocaleDateString()
        const lastUpdatedTime = new Date(parseInt(data.Result.Resources.Resource[0].LastUpdate)).toLocaleTimeString()
        const lastUpdated = `${lastUpdatedDate} ` + `${lastUpdatedTime}`
        const mainBody = data.Result.Resources.Resource[0].Sections.section
        // const relatedItems = data.Result.Resources.Resource[0].RelatedItems.RelatedItem

        const dataPackage = {
          mainTitle,
          imageAlt,
          imageUrl,
          lastUpdated,
          mainBody
        }
        
        res.json(dataPackage)
      }
    })
  }


