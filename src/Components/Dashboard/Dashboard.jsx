import React, { useState } from 'react';
import styles from './Dashboard.module.css';
import { PieChart } from 'react-minimal-pie-chart';
import dashboardData from '../utils/Dashboard.json';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(dashboardData);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [newWidget, setNewWidget] = useState({
    name: '',
    type: '',
    categoryId: dashboard.categories.length > 0 ? dashboard.categories[0].id : '',
    content: '',
    chartData: {
      labels: [],
      values: [],
      colors: [],
    }
  });

  const addWidget = (categoryId) => {
    setNewWidget((prev) => ({ ...prev, categoryId }));
    setShowAddWidget(true);
  };

  const handleAddWidget = () => {
    const { name, type, categoryId, content, chartData } = newWidget;
    if (name && type && categoryId) {
      const newWidgetData = {
        id: Date.now(),
        name,
        type,
        data: type === 'pieChart' || type === 'barChart' ? {
          labels: chartData.labels,
          values: chartData.values.map(val => parseFloat(val)),
          colors: chartData.colors,
        } : {},
        content,
      };

      setDashboard((prevState) => {
        const updatedCategories = prevState.categories.map((category) => {
          if (category.id === categoryId) {
            return { ...category, widgets: [...category.widgets, newWidgetData] };
          }
          return category;
        });
        return { ...prevState, categories: updatedCategories };
      });

      setShowAddWidget(false);
      setNewWidget({
        name: '',
        type: '',
        categoryId: '',
        content: '',
        chartData: {
          labels: [],
          values: [],
          colors: [],
        }
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewWidget((prev) => ({ ...prev, [name]: value }));
  };

  const handleChartDataChange = (e) => {
    const { name, value } = e.target;
    const updatedChartData = { ...newWidget.chartData, [name]: value.split(',').map(item => item.trim()) };
    setNewWidget((prev) => ({ ...prev, chartData: updatedChartData }));
  };

  const removeWidget = (categoryId, widgetId) => {
    setDashboard((prevState) => {
      const updatedCategories = prevState.categories.map((category) => {
        if (category.id === categoryId) {
          const updatedWidgets = category.widgets.filter((widget) => widget.id !== widgetId);
          return { ...category, widgets: updatedWidgets };
        }
        return category;
      });
      return { ...prevState, categories: updatedCategories };
    });
  };

  const renderWidgetContent = (widget) => {
    switch (widget.type) {
      case 'pieChart':
        return (
          <PieChart
            data={widget.data.labels.map((label, index) => ({
              title: label,
              value: widget.data.values[index],
              color: widget.data.colors[index],
            }))}
            animate
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
            labelStyle={{ fontSize: '5px', fill: '#fff' }}
            style={{ height: '100px' }}
          />
        );
      case 'barChart':
        return (
          <div className={styles.barChart}>
            {widget.data.labels.map((label, index) => (
              <div
                key={label}
                className={styles.bar}
                style={{
                  '--color': widget.data.colors[index],
                  height: `${(widget.data.values[index] / Math.max(...widget.data.values)) * 100}%`,
                }}
              >
                <span>{label}</span>
              </div>
            ))}
          </div>
        );
      case 'text':
        return <p>{widget.content}</p>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.head}><h1>CNAPP Dashboard</h1></div>
      
      {showAddWidget && (
        <div className={styles.addWidgetSection}>
          <h2>Add Widget</h2>
          <div className={styles.form}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={newWidget.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Type:
              <select
                name="type"
                value={newWidget.type}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="pieChart">Pie Chart</option>
                <option value="barChart">Bar Chart</option>
                <option value="text">Text</option>
              </select>
            </label>
            {newWidget.type === 'pieChart' || newWidget.type === 'barChart' ? (
              <div>
                <label>
                  Labels (comma separated):
                  <input
                    type="text"
                    name="labels"
                    value={newWidget.chartData.labels.join(', ')}
                    onChange={handleChartDataChange}
                  />
                </label>
                <label>
                  Values (comma separated):
                  <input
                    type="text"
                    name="values"
                    value={newWidget.chartData.values.join(', ')}
                    onChange={handleChartDataChange}
                  />
                </label>
                <label>
                  Colors (comma separated):
                  <input
                    type="text"
                    name="colors"
                    value={newWidget.chartData.colors.join(', ')}
                    onChange={handleChartDataChange}
                  />
                </label>
              </div>
            ) : null}
            {newWidget.type === 'text' && (
              <label>
                Content:
                <textarea
                  name="content"
                  value={newWidget.content}
                  onChange={handleChange}
                />
              </label>
            )}
          </div>
          <div className={styles.tabs}>
            {dashboard.categories.map((category) => (
              <button
                key={category.id}
                className={newWidget.categoryId === category.id ? styles.activeTab : ''}
                onClick={() => setNewWidget((prev) => ({ ...prev, categoryId: category.id }))}
              >
                {category.name}
              </button>
            ))}
          </div>
          <button className={styles.confirmButton} onClick={handleAddWidget}>
            Add Widget
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => setShowAddWidget(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <div className={styles.dashboardGrid}>
        {dashboard.categories.map((category) => (
          <div key={category.id} className={styles.category}>
            <h2>{category.name}</h2>
            <div className={styles.widgets}>
              {category.widgets.map((widget) => (
                <div key={widget.id} className={styles.card}>
                  <h3>{widget.name}</h3>
                  {renderWidgetContent(widget)}
                  <button
                    className={styles.removeButton}
                    onClick={() => removeWidget(category.id, widget.id)}
                  >
                    &times; Remove Widget
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.addWidgetContainer}>
              <button
                className={styles.addButton}
                onClick={() => addWidget(category.id)}
              >
                + Add Widget
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
