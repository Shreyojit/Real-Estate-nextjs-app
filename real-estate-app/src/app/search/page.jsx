
"use client"
import React, { useEffect, useState } from 'react';
import classes from './search.module.css';
import PropertyCard from '@/components/propertyCard/PropertyCard';
import { useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { useRouter } from 'next/navigation';
import { countries, types } from '@/components/searchModal/searchModalData';

const Search = () => {
    const [estates, setEstates] = useState([]);
    const [filteredEstates, setFilteredEstates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const fetchEstates = async () => {
            try {
                setIsLoading(true);
                const res = await fetch("http://localhost:3000/api/property");
                const data = await res.json();
                setEstates(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEstates();
    }, []);

    useEffect(() => {
        const filteredProperties = () => {
            if (isLoading || estates?.length === 0 || !searchParams) return;

            const { type, country, minPrice, maxPrice } = qs.parse(searchParams.toString());

            setFilteredEstates(estates.filter((estate) => {
                const ci = countries.findIndex((c) => c === estate.country);
                const ti = types.findIndex((t) => t === estate.type);
                return (
                    ci === Number(country)
                    && ti === Number(type)
                    && estate.price > Number(minPrice)
                    && estate.price < Number(maxPrice)
                );
            }));
        };

        filteredProperties(); // Call the filtering function when estates or searchParams change.
    }, [estates, searchParams]);

    console.log(estates);
    console.log(filteredEstates);

    return (
        <div className={classes.container}>
        <div className={classes.wrapper}>
            <div className={classes.titles}>
                <h2 className={classes.mainTitle}>Here are your desired properties</h2>
                <h5 className={classes.secondaryTitle}>
                    Happy browsing
                </h5>
            </div>
            <div className={classes.properties}>
                {filteredEstates?.map((estate) => (
                    <PropertyCard
                        key={estate?._id}
                        property={estate}
                    />
                ))}
            </div>
        </div>
        <div onClick={() => {
            router.push("/")
        }} className={classes.goBack}>
            <AiOutlineArrowLeft size={25} />
            <span>Go Back</span>
        </div>
    </div>
    );
};

export default Search;
