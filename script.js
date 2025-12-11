// 睡眠周期常量（分钟）
const SLEEP_CYCLE = 90;
const FALL_ASLEEP_TIME = 14;

// 显示指定视图
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

// 返回主界面
function goBack() {
    showView('calculatorView');
}

// 格式化时间
function formatTime(hours, minutes, period) {
    return `${period === 'PM' ? '下午' : '上午'} ${hours}:${minutes.toString().padStart(2, '0')}`;
}

// 将12小时制转换为分钟数
function timeToMinutes(hours, minutes, period) {
    let totalHours = parseInt(hours);
    if (period === 'PM' && totalHours !== 12) {
        totalHours += 12;
    } else if (period === 'AM' && totalHours === 12) {
        totalHours = 0;
    }
    return totalHours * 60 + parseInt(minutes);
}

// 将分钟数转换为12小时制
function minutesToTime(totalMinutes) {
    // 处理跨天情况
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
    
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    let period = 'AM';
    
    if (hours >= 12) {
        period = 'PM';
        if (hours > 12) {
            hours -= 12;
        }
    }
    if (hours === 0) {
        hours = 12;
    }
    
    return { hours, minutes, period };
}

// 计算就寝时间
function calculateBedtime() {
    const hour = document.getElementById('hourSelect').value;
    const minute = document.getElementById('minuteSelect').value;
    const period = document.getElementById('periodSelect').value;
    
    const wakeTimeMinutes = timeToMinutes(hour, minute, period);
    const wakeTimeFormatted = formatTime(hour, minute, period);
    
    document.getElementById('selectedWakeTime').textContent = wakeTimeFormatted;
    
    const bedtimeList = document.getElementById('bedtimeList');
    bedtimeList.innerHTML = '';
    
    // 生成6个睡眠周期的建议时间（从6个周期到1个周期）
    for (let cycles = 6; cycles >= 1; cycles--) {
        const sleepDuration = cycles * SLEEP_CYCLE;
        const bedtimeMinutes = wakeTimeMinutes - sleepDuration - FALL_ASLEEP_TIME;
        const bedtime = minutesToTime(bedtimeMinutes);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="time">${formatTime(bedtime.hours, bedtime.minutes, bedtime.period)}</div>
            <div class="cycles">${cycles} 个睡眠周期 (${sleepDuration / 60} 小时)</div>
        `;
        bedtimeList.appendChild(resultItem);
    }
    
    showView('bedtimeResults');
}

// 计算起床时间
function calculateWakeup() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // 加上入睡时间
    const sleepStartMinutes = currentMinutes + FALL_ASLEEP_TIME;
    
    const wakeupList = document.getElementById('wakeupList');
    wakeupList.innerHTML = '';
    
    // 生成6个睡眠周期的建议起床时间
    for (let cycles = 1; cycles <= 6; cycles++) {
        const sleepDuration = cycles * SLEEP_CYCLE;
        const wakeupMinutes = sleepStartMinutes + sleepDuration;
        const wakeupTime = minutesToTime(wakeupMinutes);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="time">${formatTime(wakeupTime.hours, wakeupTime.minutes, wakeupTime.period)}</div>
            <div class="cycles">${cycles} 个睡眠周期 (${sleepDuration / 60} 小时)</div>
        `;
        wakeupList.appendChild(resultItem);
    }
    
    showView('wakeupResults');
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置默认时间为上午7:00
    document.getElementById('hourSelect').value = '7';
    document.getElementById('minuteSelect').value = '00';
    document.getElementById('periodSelect').value = 'AM';
});
