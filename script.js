document.addEventListener("DOMContentLoaded", function () {
  /* ------------------ 左侧荔枝路径滚动 ------------------ */
  const lizhi = document.getElementById("lizhi-icon-svg");
  const path = document.getElementById("path");
  const texts = document.querySelectorAll("#sidebar text");
  const sections = document.querySelectorAll("section");
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");
  const cover = document.querySelector(".cover");

  const pathLength = 1050; 

  function updateLizhiPosition() {
      const scrollY = window.scrollY;
      const startOffset = window.innerHeight;
      const totalHeight = document.body.scrollHeight - window.innerHeight - startOffset;

      let scrollRatio = 0;
      if (scrollY > startOffset) {
          scrollRatio = (scrollY - startOffset) / totalHeight;
          scrollRatio = Math.min(scrollRatio, 1);
      }

      if(path){
          const point = path.getPointAtLength(scrollRatio * pathLength);
          const lizhiX = point.x - 45;
          const lizhiY = point.y - 45;
          lizhi.setAttribute("x", lizhiX);
          lizhi.setAttribute("y", lizhiY);

          // 激活最接近的 text
          let closestText = null;
          let minDiff = Infinity;
          texts.forEach(t => {
              const textY = parseFloat(t.getAttribute("y"));
              const diff = Math.abs(lizhiY - textY);
              if (diff < minDiff) {
                  minDiff = diff;
                  closestText = t;
              }
          });
          if (closestText) {
              texts.forEach(t => t.classList.remove("active"));
              closestText.classList.add("active");
          }
      }
  }

  // 点击 text 时滚动到对应 section
  texts.forEach(text => {
      text.addEventListener("click", function () {
          const targetId = text.getAttribute("data-target");
          const targetElement = document.getElementById(targetId);
          if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
      });
  });

  /* ------------------ 滚动控制 sidebar ------------------ */
  function handleScroll() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      if (scrollTop > windowHeight * 0.8) {
          sidebar.classList.add("visible");
          content.classList.add("with-sidebar");
      } else {
          sidebar.classList.remove("visible");
          content.classList.remove("with-sidebar");
      }
      updateLizhiPosition();
  }

  document.querySelector(".scroll-indicator")?.addEventListener("click", () => {
      window.scrollTo({ top: cover.offsetHeight, behavior: "smooth" });
  });

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  

  /* ------------------ highlight 文字入场 ------------------ */
  document.querySelectorAll('.highlight-animate').forEach(el => {
      if (!('IntersectionObserver' in window)) { el.classList.add('highlight-in'); return; }
      const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
              if(entry.isIntersecting){ entry.target.classList.add('highlight-in'); obs.unobserve(entry.target); }
          });
      }, { threshold: 0.5 });
      observer.observe(el);
  });

  /* ------------------ step-img 动画 ------------------ */
  document.querySelectorAll('.step img').forEach(img => {
      if (!('IntersectionObserver' in window)) { img.classList.add('step-img-in'); return; }
      const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
              if(entry.isIntersecting){ entry.target.classList.add('step-img-in'); obs.unobserve(entry.target); }
          });
      }, { threshold: 0.3 });
      observer.observe(img);
  });

  /* ------------------ tech-module 动画 ------------------ */
  document.querySelectorAll('.tech-module').forEach(module => {
      module.style.opacity = 0;
      module.style.transform = 'translateY(30px)';
      module.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver((entries, obs) => {
              entries.forEach(entry => {
                  if(entry.isIntersecting){ entry.target.style.opacity=1; entry.target.style.transform='translateY(0)'; obs.unobserve(entry.target); }
              });
          }, { threshold: 0.1 });
          observer.observe(module);
      } else {
          module.style.opacity = 1; module.style.transform='translateY(0)';
      }
  });

  /* ------------------ fly 元素随机动画 ------------------ */
  document.querySelectorAll('.fly').forEach(el => {
      let delay = Math.random() * 2;
      let duration = 3 + Math.random() * 2;
      el.style.animationDelay = `${delay}s`;
      el.style.animationDuration = `${duration}s`;
  });

});

// 地形图悬浮切换
const vizButtons = document.querySelectorAll('.viz-btn');
const vizImage = document.querySelector('.viz-img');
const vizText = document.querySelector('.viz-text');

vizButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        const imgSrc = this.getAttribute('data-img');
        const textContent = this.getAttribute('data-text');
        
        vizImage.src = imgSrc;
        vizImage.alt = textContent.split('<br>')[0]; 
        vizText.innerHTML = textContent;
    });
});

const fertilizerChartDom = document.getElementById('fertilizer-chart');
if (fertilizerChartDom) {
  const fertilizerChart = echarts.init(fertilizerChartDom);

  const option = {
    title: {
      text: '有机肥助力低碳荔枝优产提效',
      left: 'center',
      top: 10,
      textStyle: { fontSize: 22, color: '#2C3E50', fontWeight: '600' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(50,50,50,0.8)',
      textStyle: { color: '#fff' }
    },
    grid: {
      top: 70,
      left: '10%',
      right: '5%',
      bottom: '12%'
    },
    xAxis: {
      type: 'category',
      data: ['化肥用量', '产量', '糖度', '维生素C', '平均价格'],
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#ccc' } },
      axisLabel: { fontSize: 13, color: '#555' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      axisLabel: { fontSize: 13, color: '#555' }
    },
    series: [
      {
        name: '变化率',
        type: 'bar',
        barWidth: 40,
        data: [-20, 14, 2.2, 16.3, null],
        itemStyle: {
          color: params => {
            if (params.value < 0) {
              return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#f8786c' },
                { offset: 1, color: '#fbb1a0' }
              ]);
            } else {
              return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#6B8E23' },
                { offset: 1, color: '#a3c76b' }
              ]);
            }
          },
          barBorderRadius: [6, 6, 0, 0],
          shadowColor: 'rgba(0,0,0,0.15)',
          shadowBlur: 6,
          shadowOffsetY: 3
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          formatter: params => params.value != null ? `${params.value}%` : '',
          color: '#333',
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: [2, 4],
          borderRadius: 4
        },
        animationDuration: 1200
      },
      {
        name: '价格',
        type: 'bar',
        barWidth: 40,
        data: [null, null, null, null, 12],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#fff59d' },
            { offset: 1, color: '#ffec82' }
          ]),
          barBorderRadius: [6, 6, 0, 0],
          shadowColor: 'rgba(0,0,0,0.15)',
          shadowBlur: 6,
          shadowOffsetY: 3
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          color: '#333',
          formatter: params => params.value != null ? `${params.value}元/斤` : '',
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: [2, 4],
          borderRadius: 4
        },
        animationDuration: 1200
      }
    ]
  };

  fertilizerChart.setOption(option);
}

// ---------------- 地图 ----------------
const lycheeMapDom = document.getElementById('lychee-map');
if (lycheeMapDom && window.echarts) {
    const mapChart = echarts.init(lycheeMapDom, null, { renderer: 'canvas', useDirtyRect: false });
    const mapOption = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: params => params.value != undefined ? `${params.name}<br/>产量: <strong>${params.value}</strong> 万吨` : `${params.name}<br/>暂无数据`
        },
        visualMap: {
          show: true,
          left: 10,      // 离左边 10px
          bottom: 100,    // 离底部 10px
          width: 15,
          height: 100,
          min: 0,
          max: 220,
          text: ['高','低'],
          calculable: true,
          inRange: { color: ['#b7e1a1', '#8cc96c', '#5fa946', '#f8786c'] }
      },
        series: [{
            type: 'map',
            map: 'china',
            roam: false,
            label: { show: false },
            data: [
                {name: '广东省', value: 206.26},
                {name: '广西壮族自治区', value: 114.51},
                {name: '海南省', value: 18.4},
                {name: '福建省', value: 13.26},
                {name: '四川省', value: 4.88},
                {name: '云南省', value: 7.73}
            ]
        }]
    };
    mapChart.setOption(mapOption);
}

// ---------------- 柱状图 ----------------
const barDom = document.getElementById('bar-chart');
if (barDom && window.echarts) {
    const barChart = echarts.init(barDom);

    const barOption = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
            type: 'category',
            data: ['广东','北京','江苏','浙江','上海','山东'],
            axisTick: { alignWithLabel: true }
        },
        yAxis: {
            type: 'value',
            max: 15,
            axisLabel: { formatter: '{value}%' }
        },
        series: [{
            data: [12.4,10.6,10.3,7.6,5.6,4.9],
            type: 'bar',
            itemStyle: { color: '#f8786c' },
            barWidth: '50%',
            label: { show: true, position: 'top', formatter: '{c}%' }
        }]
    };

    barChart.setOption(barOption);
}
