// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;
import "./ERC20.sol";

contract ZeroToken is ERC20 {
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can mint");
        _;
    }

    constructor() ERC20("Zero Token", "Z3R0", msg.sender) {
        owner = msg.sender;
        _mint(msg.sender, 1_00_000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address to, uint amount) external onlyOwner {
        _burn(to, amount);
    }

    function burn(uint amount) external {
        _burn(msg.sender, amount);
    }

    function blacklistAccount(address _add) public onlyOwner {
        _blacklistAccount(_add);
    }

    function removeBlacklistAccount(address _add) public onlyOwner {
        _removeBlacklistAccount(_add);
    }

    function setAdminTax(uint _amt) public onlyOwner {
        require(_amt <= 20, "You can not take more than 20% of tx Admin");
        adminTax = _amt;
    }

    function changeAdminAddress(address _addr) public onlyOwner {
        admin = _addr;
    }
}
