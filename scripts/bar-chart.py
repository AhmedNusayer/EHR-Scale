import matplotlib.pyplot as plt

metrics = ['Accuracy', 'Latency', 'Throughput']
approach_1 = [0.92, 120, 300]
approach_2 = [0.89, 95, 340]

x = range(len(metrics))
bar_width = 0.35

# Plotting the bars
fig, ax = plt.subplots()
bars1 = ax.bar([i - bar_width / 2 for i in x], approach_1, bar_width, label='Approach 1', color='skyblue')
bars2 = ax.bar([i + bar_width / 2 for i in x], approach_2, bar_width, label='Approach 2', color='salmon')

# Labels and legend
ax.set_xlabel('Metrics')
ax.set_ylabel('Values')
ax.set_title('Performance Comparison of Two Approaches')
ax.set_xticks(x)
ax.set_xticklabels(metrics)
ax.legend()

def add_labels(bars):
    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{height:.2f}',
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3),
                    textcoords="offset points",
                    ha='center', va='bottom')

add_labels(bars1)
add_labels(bars2)

plt.tight_layout()
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.show()
