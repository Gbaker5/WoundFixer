
document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById('woundChart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: window.chartData, // <-- use window.chartData
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Wound Healing Progress'
        }
      }
    }
  });
});
