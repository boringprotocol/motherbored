// /pages/airdrip.tsx
import { useSession } from 'next-auth/react';
import LayoutAuthenticated from '../components/layoutAuthenticated';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Head from 'next/head';
import { IoWaterOutline } from 'react-icons/io5';
import DateRangePicker from 'components/DateRangePicker';
import { useRouter } from 'next/router';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { BsFillQuestionCircleFill } from 'react-icons/bs';

const Airdrip: React.FC = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tokenMintAddress: '',
    tokenDecimals: '',
    startDate: '',
    endDate: '',
  });

  if (!session) {
    console;
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleStartDateChange = (startDate: string) => {
    setFormData({
      ...formData,
      startDate,
    });
  };

  const handleEndDateChange = (endDate: string) => {
    setFormData({
      ...formData,
      endDate,
    });
  };

  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/create-drip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newDrip = await response.json();
        router.push(`/drip/${newDrip.id}`);
      } else {
        const error = await response.json();
        console.error('Error creating drip (status):', response.status);
        console.error('Error creating drip (details):', error);
        alert('An error occurred while creating the drip. Please try again.');
      }
    } catch (error) {
      console.error('Error creating drip (exception):', error);
      alert('An error occurred while creating the drip. Please try again.');
    }
  };

  return (
    <LayoutAuthenticated>
      <Head>
        <title>Motherbored</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="apple-touch-icon" href="/img/favicon.png" />
      </Head>

      <div className="font-jetbrains mt-12 px-12 ">
        {/* {name} */}

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">

              <h1 className="pt-8 text-3xl flex items-center">
                <span className="mr-1">
                  <IoWaterOutline />
                </span>
                aird.rip
              </h1>

              <h2 className="text-xs ml-6">from Boring Protocol</h2>

            </div>

            <div className="mt-12">
              <MarkdownPreview value={formData.description} />
            </div>

            {/* The button to open modal */}
            <label htmlFor="my-modal-6" className="btn btn-sm btn-ghost btn-circle"><BsFillQuestionCircleFill /></label>

            {/* Put this part before </body> tag */}
            <input type="checkbox" id="my-modal-6" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Something To Explain</h3>
                <p className="py-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat ratione dolor ab! Ad, corporis. Animi accusamus reprehenderit molestias hic suscipit velit neque, inventore non tempore quas corporis itaque libero laudantium.</p>
                <div className="modal-action">
                  <label htmlFor="my-modal-6" className="btn">Ok</label>
                </div>
              </div>
            </div>


          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="shadow sm:overflow-hidden sm:rounded-md p-8">

              <div className="prose">
                <h2 className="text-xl mb-2">Build A Drip</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-control w-full max-w-xs">
                    <label className="label">
                      <span className="label-text">Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Dank Drip"
                      className="input input-bordered w-full max-w-xs"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-control mt-6">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24"
                      placeholder="Enter description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="form-control w-full max-w-xs mt-6">
                    <label className="label">
                      <span className="label-text">Token Mint Address</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter token mint address"
                      className="input input-bordered w-full max-w-xs"
                      name="tokenMintAddress"
                      value={formData.tokenMintAddress}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-control w-full max-w-xs mt-6">
                    <label className="label">
                      <span className="label-text">Token decimals</span>
                    </label>
                    <select
                      className="select select-bordered"
                      name="tokenDecimals"
                      value={formData.tokenDecimals}
                      onChange={handleInputChange}
                    >
                      <option disabled selected>
                        Decimals
                      </option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                    </select>
                  </div>

                  <div className="mt-6">
                    {/* start_date, end_date */}
                    <DateRangePicker
                      onStartDateChange={handleStartDateChange}
                      onEndDateChange={handleEndDateChange}
                    />
                  </div>

                  <button className="btn btn-outline mt-6" type="submit">
                    Create Drip
                  </button>
                </form>
              </div>


            </div>
          </div>
        </div>

      </div>

    </LayoutAuthenticated>

  );
};

export default Airdrip;

