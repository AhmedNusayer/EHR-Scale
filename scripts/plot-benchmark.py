import json
import matplotlib.pyplot as plt

with open("benchmark_results.json") as f:
    results = json.load(f)

tx_counts = [r["batchSize"] for r in results]
tps_values = [r["tps"] for r in results]
times = [r["time"] for r in results]

plt.figure(figsize=(10, 6))
plt.plot(tx_counts, tps_values, marker='o', label='TPS')
plt.bar(tx_counts, times, alpha=0.0, label='Total Time (s)', width=8)

plt.xlabel("Batch Size (100 Transactions)")
plt.ylabel("TSP")
plt.title("Blockchain Transaction Benchmark (TPS & Time)")

# Set y-axis limits
plt.ylim(0, 5)

plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig("benchmark_plot_zksync.png")
plt.show()
