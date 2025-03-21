import React, { useEffect, useState } from "react";
import axios from "axios";

function BranchList() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/branches")
      .then((response) => setBranches(response.data))
      .catch((err) => console.error("Error fetching branches", err));
  }, []);

  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full xl:w-10/12 mb-12 xl:mb-0 px-4 ml-60 mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg">
          <div className="mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold bg-blue-50 text-xl text-blue-700">
                  List of Branches
                </h3>
              </div>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-6 bg-gray-100 text-blue-400 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Branch Name
                  </th>
                  <th className="px-6 bg-gray-100 text-blue-400 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Location
                  </th>
                  <th className="px-6 bg-gray-100 text-blue-400 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Manager
                  </th>
                </tr>
              </thead>

              <tbody>
                {branches.map((branch) => (
                  <tr key={branch._id}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                      {branch.branchName}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {branch.location}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {branch.manager ? branch.manager.name : "No Manager Assigned"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BranchList;
