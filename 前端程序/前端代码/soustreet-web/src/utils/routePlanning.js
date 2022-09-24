function busRoutePlanning(startPosition, endPosition, map) {
  const polylineLayer = new TMap.MultiPolyline({
    id: 'polyline-layer',
    map: map,
    styles: {
      style_blue: new TMap.PolylineStyle({
        color: '#3777FF',
        width: 10,
        borderWidth: 0,
        showArrow: true,
        arrowOptions: {
          space: 70,
        },
        lineCap: 'round',
      }),
    },
    geometries: [],
  })
  const transit = new TMap.service.Transit({
    policy: 'LEAST_WALKING', // 规划策略
  })
  transit.search({ from: startPosition, to: endPosition }).then((result) => {
    let route = result.result.routes[0]
    let rainbowPaths = []
    let describe = ''
    route.steps.forEach((step) => {
      if (step.mode === 'WALKING') {
        rainbowPaths.push({ path: step.polyline, color: 'rgba(51, 51, 255, 1)' }) //绘制步行路线
        describe += `步行(${step.duration}分钟)\n`
        step.steps &&
          step.steps.forEach((subStep, index) => {
            describe += `${index + 1}. ${subStep.instruction}\n` // 显示步行指引
          })
      } else {
        step.lines.forEach((line) => {
          if (line.vehicle === 'SUBWAY') {
            rainbowPaths.push({ path: line.polyline, color: 'rgba(245, 185, 23, 1)' }) //绘制地铁路线
          } else {
            rainbowPaths.push({ path: line.polyline, color: 'rgba(28, 204, 108, 1)' }) //绘制非地铁公交路线
          }
          describe += `搭乘${line.title}(${line.duration}分钟)\n`
          describe += `上车站：${line.geton.title}\n`
          describe += `下车站：${line.getoff.title}\n`
        })
      }
    })
    console.log('describe', describe)
    polylineLayer.updateGeometries([
      {
        styleId: 'style_blue',
        rainbowPaths: rainbowPaths,
      },
    ])
  })
}

function drivingRoutePlanning(startPosition, endPosition, map, callback) {
  const driving = new TMap.service.Driving({
    // 新建一个驾车路线规划类
    mp: false, // 是否返回多方案
    policy: 'PICKUP,NAV_POINT_FIRST', // 规划策略
  })
  driving.search({ from: startPosition, to: endPosition }).then((result) => {
    let describe = ''
    // 搜索路径
    result.result.routes[0].steps.forEach((step, index) => {
      // 展示路线引导
      describe += `${index + 1}. ${step.instruction}\n`
    })
    displayPolyline(result.result.routes[0].polyline, map) // 绘制路径折线
    // console.log(callback)
    callback(describe)
  })
}

const polylineLayer = new TMap.MultiPolyline({
  id: 'polyline-layer',
  styles: {
    style_blue: new TMap.PolylineStyle({
      color: '#3777FF',
      width: 8,
      borderWidth: 5,
      borderColor: '#FFF',
      lineCap: 'round',
    }),
  },
})

function displayPolyline(pl, map) {
  // 创建 MultiPolyline显示路径折线
  polylineLayer.setMap(map)
  polylineLayer.remove('pl_1')
  polylineLayer.setGeometries([
    {
      id: 'pl_1',
      styleId: 'style_blue',
      paths: pl,
    },
  ])
}

export { busRoutePlanning, drivingRoutePlanning }
