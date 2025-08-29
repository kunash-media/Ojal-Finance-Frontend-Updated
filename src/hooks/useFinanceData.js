import { useState, useEffect } from 'react';
import {
  getLineChartData,
  getBarChartData,
  getPieChartData,
  getCustomersData,
  getStatCardsData
} from '../api/financeApi';

export const useFinanceData = () => {
  const [data, setData] = useState({
    lineChart: null,
    barChart: null,
    pieChart: null,
    customers: null,
    stats: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lineChart, barChart, pieChart, customers, stats] = await Promise.all([
          getLineChartData(),
          getBarChartData(),
          getPieChartData(),
          getCustomersData(),
          getStatCardsData()
        ]);

        setData({
          lineChart,
          barChart,
          pieChart,
          customers,
          stats,
          loading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchData();
  }, []);

  return data;
};


import { useState, useEffect } from 'react';

/**
 * Custom hook for handling debounced searches
 * @param {Function} searchFunction - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Object} - The search state and handlers
 */
export const useDebounceSearch = (searchFunction, delay = 500) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchTerm.trim()) return;

    const handler = setTimeout(() => {
      setIsSearching(true);
      searchFunction(searchTerm, searchType)
        .finally(() => setIsSearching(false));
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, searchType, searchFunction, delay]);

  return {
    searchTerm,
    setSearchTerm,
    searchType,
    setSearchType,
    isSearching
  };
};

/**
 * Custom hook for managing modal states
 * @returns {Object} - Modal state and handlers
 */
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  const openModal = (modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setData(null);
  };

  return {
    isOpen,
    data,
    openModal,
    closeModal
  };
};

/**
 * Custom hook for handling form data
 * @param {Object} initialValues - Initial form values
 * @returns {Object} - Form state and handlers
 */
export const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setValues({
      ...values,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    resetForm,
    isSubmitting,
    setIsSubmitting
  };
};

export default {
  useDebounceSearch,
  useModal,
  useForm
};